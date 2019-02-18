import request = require('request');
import Utility from './common/utility';

const ADDRESSES = {
    FRONTEND: {
        TEST: 'https://checkout-uat.collector.se',
        PRODUCTION: 'https://checkout.collector.se'
    },
    BACKEND: {
        TEST: 'https://checkout-api-uat.collector.se',
        PRODUCTION: 'https://checkout-api.collector.se'
    }
}

export type CountryCode =
    'SE'
    | 'NO'
    | 'FI'
    | 'DK'
    | 'DE'


export type PaymentStatus =
    'Initialized'
    | 'CustomerIdentified'
    | 'CommittedToPurchase'
    | 'PurchaseCompleted'

export type PaymentName =
    'DirectInvoice'
    | 'Account'
    | 'Card'
    | 'BankTransfer'
    | 'PartPayment'
    | 'Campaign'
    | 'Trustly'

export type PurchaseResult =
    'Preliminary'
    | 'OnHold'
    | 'Activated'
    | 'Rejected'
    | 'Signing '


export interface Config {
    username: string,
    accessKey: string,
    storeId?: number,
    test: boolean,
    countryCode: CountryCode
}

export interface Fee {
    id: string,
    description: string,
    unitPrice: number,
    vat: number
}

export interface Fees {
    shipping?: Fee,
    directInvoiceNotification?: Fee
}

export interface CartItem {
    id: string,
    description: string,
    unitPrice: number,
    quantity: number,
    vat: number,
    requiresElectronicId?: boolean,
    sku?: string
}

export interface Cart {
    items: CartItem[]
}

export interface Address {
    firstName: string,
    lastName: string,
    coAddress: string,
    address: string,
    address2: string,
    postalCode: string,
    city: string,
    country: string
}

export interface CustomerInfo {
    email: string,
    mobilePhoneNumber: string,
    nationalIdentificationNumber?: string
}

export interface Customer extends CustomerInfo {
    deliveryContactInformation: {
        mobilePhoneNumber: string,
        email: string
    },
    deliveryAddress: Address,
    billingAddress: Address,
}

export interface BusinessCustomer extends Customer {
    invoiceAddress?: Address
}

export interface Purchase {
    amountToPay: number,
    paymentName: PaymentName,
    invoiceDeliveryMethod: string,
    purchaseIdentifier: string,
    result: PurchaseResult
}

export interface Order {
    totalAmount: number,
    items: CartItem[]
}

export interface InitCheckoutRequest {
    reference?: string,
    redirectPageUri?: string,
    merchantTermsUri: string,
    notificationUri: string,
    validationUri?: string,
    profileName?: string,
    cart: CartItem[],
    fees?: Fees,
    customer?: CustomerInfo
}

export interface Response {
    id: string,
    data?: any,
    error?: any
}

export interface InitCheckoutResponse extends Response {
    data?: {
        publicToken: string,
        privateId: string,
        expiresAt: string
    }
}



export interface CheckoutSession {
    data: {
        countryCode?: string,
        status: PaymentStatus,
        paymentName: PaymentName,
        reference: string,
        cart?: Cart,
        fees?: Fees,
        customerType: string,
        customer?: Customer,
        businessCustomer?: BusinessCustomer,
        purchase?: Purchase,
        order: Order

    }
}


export class CollectorCheckout {
    private config: Config;
    private authorizationGenerator: (body: string, path: string) => string;
    constructor(config: Config) {
        if (!config.username)
            throw new Error('You need to provide a username.');
        if (!config.accessKey)
            throw new Error('You need to provide an access key.');
        this.config = config;
        this.authorizationGenerator = Utility.authorizationGenerator(config.username, config.accessKey);
    }

    public getApiUrl = (path: string) => {
        return `${ADDRESSES.BACKEND[this.config.test ? 'TEST' : 'PRODUCTION']}${path}`;
    }

    public getFrontendUrl = (path: string) => {
        return `${ADDRESSES.FRONTEND[this.config.test ? 'TEST' : 'PRODUCTION']}${path}`;
    }

    private request = async (method: string, path: string, data?: any) => {
        data = Object.assign(data || {}, {
            storeId: this.config.storeId,
            countryCode: this.config.countryCode
        });
        return await new Promise((resolve, reject) => {
            request({
                method: method,
                headers: {
                    'Authorization': this.authorizationGenerator(JSON.stringify(data), path)
                },
                url: this.getApiUrl(path),
                json: data
            }, (error, res, body) => {
                if (error) {
                    reject(error);
                }
                else if (res.statusCode == 200) {
                    resolve(body);
                }
                else if (body) {
                    if (body.error)
                        reject(body.error);
                    else
                        reject(body);
                }
                else {
                    reject(res);
                }
            });
        });
    }

    // Utility method for getting the script tag
    public getScriptTag = (
        config: {
            publicToken: string,
            padding?: boolean,
            id?: string,
            actionColor?: string
        }) => {

        let attributes = `src="${this.getFrontendUrl('/collector-checkout-loader.js')}"`;
        attributes += ` data-token="${config.publicToken}"`;

        if (!config.padding)
            attributes += ` data-padding="none"`;
        if (config.id)
            attributes += ` data-container-id="${config.id}"`;
        if (config.actionColor)
            attributes += ` data-action-color="${config.actionColor}"`;

        return `<script ${attributes} ></script>`;
    }

    // API methods
    public initCheckout = async (data: InitCheckoutRequest): Promise<InitCheckoutResponse> => {
        return await this.request('POST', '/checkout', data) as Promise<InitCheckoutResponse>;
    };

    public updateCart = async (privateId: string, data: Cart): Promise<Response> => {
        return await this.request('PUT', `/merchants/${this.config.storeId}/checkouts/${privateId}/cart`, data) as Promise<Response>;
    };

    public updateFees = async (privateId: string, data: Fees): Promise<Response> => {
        return await this.request('PUT', `/merchants/${this.config.storeId}/checkouts/${privateId}/fees`, data) as Promise<Response>;
    };

    public updateReference = async (privateId: string, reference: string): Promise<Response> => {
        return await this.request('PUT', `/merchants/${this.config.storeId}/checkouts/${privateId}/reference`, { reference: reference }) as Promise<Response>;
    };

    public getCheckoutSession = async (privateId: string): Promise<CheckoutSession> => {
        return await this.request('GET', `/merchants/${this.config.storeId}/checkouts/${privateId}`) as Promise<CheckoutSession>;
    };

}


