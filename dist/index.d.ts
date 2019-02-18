export declare type CountryCode = 'SE' | 'NO' | 'FI' | 'DK' | 'DE';
export declare type PaymentStatus = 'Initialized' | 'CustomerIdentified' | 'CommittedToPurchase' | 'PurchaseCompleted';
export declare type PaymentName = 'DirectInvoice' | 'Account' | 'Card' | 'BankTransfer' | 'PartPayment' | 'Campaign' | 'Trustly';
export declare type PurchaseResult = 'Preliminary' | 'OnHold' | 'Activated' | 'Rejected' | 'Signing ';
export interface Config {
    username: string;
    accessKey: string;
    storeId?: number;
    test: boolean;
    countryCode: CountryCode;
}
export interface Fee {
    id: string;
    description: string;
    unitPrice: number;
    vat: number;
}
export interface Fees {
    shipping?: Fee;
    directInvoiceNotification?: Fee;
}
export interface CartItem {
    id: string;
    description: string;
    unitPrice: number;
    quantity: number;
    vat: number;
    requiresElectronicId?: boolean;
    sku?: string;
}
export interface Cart {
    items: CartItem[];
}
export interface Address {
    firstName: string;
    lastName: string;
    coAddress: string;
    address: string;
    address2: string;
    postalCode: string;
    city: string;
    country: string;
}
export interface CustomerInfo {
    email: string;
    mobilePhoneNumber: string;
    nationalIdentificationNumber?: string;
}
export interface Customer extends CustomerInfo {
    deliveryContactInformation: {
        mobilePhoneNumber: string;
        email: string;
    };
    deliveryAddress: Address;
    billingAddress: Address;
}
export interface BusinessCustomer extends Customer {
    invoiceAddress?: Address;
}
export interface Purchase {
    amountToPay: number;
    paymentName: PaymentName;
    invoiceDeliveryMethod: string;
    purchaseIdentifier: string;
    result: PurchaseResult;
}
export interface Order {
    totalAmount: number;
    items: CartItem[];
}
export interface InitCheckoutRequest {
    reference?: string;
    redirectPageUri?: string;
    merchantTermsUri: string;
    notificationUri: string;
    validationUri?: string;
    profileName?: string;
    cart: CartItem[];
    fees?: Fees;
    customer?: CustomerInfo;
}
export interface Response {
    id: string;
    data?: any;
    error?: any;
}
export interface InitCheckoutResponse extends Response {
    data?: {
        publicToken: string;
        privateId: string;
        expiresAt: string;
    };
}
export interface CheckoutSession {
    data: {
        countryCode?: string;
        status: PaymentStatus;
        paymentName: PaymentName;
        reference: string;
        cart?: Cart;
        fees?: Fees;
        customerType: string;
        customer?: Customer;
        businessCustomer?: BusinessCustomer;
        purchase?: Purchase;
        order: Order;
    };
}
export declare class CollectorCheckout {
    private config;
    private authorizationGenerator;
    constructor(config: Config);
    private getApiUrl;
    private request;
    getScriptTag: (config: {
        publicToken: string;
        padding?: boolean | undefined;
        id?: string | undefined;
        actionColor?: string | undefined;
    }) => string;
    initCheckout: (data: InitCheckoutRequest) => Promise<InitCheckoutResponse>;
    updateCart: (privateId: string, data: Cart) => Promise<Response>;
    updateFees: (privateId: string, data: Fees) => Promise<Response>;
    updateReference: (privateId: string, reference: string) => Promise<Response>;
    getCheckoutSession: (privateId: string) => Promise<CheckoutSession>;
}
