# Collector Checkout
A Node.js module for Collector Checkout API integration.

## Getting Started

Read the [Collector Checkout API documentation](http://web-checkout-documentation.azurewebsites.net/#) and [contact merchant@collectorbank.se](mailto:merchant@collectorbank.se) to obtain a username, store ID, and access key.


#### This module is still under development.

### Installing

```
    npm install collector-checkout
```


## Examples

Require the module:
```javascript
    let Collector = require('collector-checkout');
```

Initialize the module with your username, access key, and store ID:
```javascript
    let collectorCheckout = new Collector.CollectorCheckout('your-username', 'your-access-key', 'your-store-id');
```

To target the test environment:
```javascript
    let collectorCheckout = new Collector.CollectorCheckout('your-username', 'your-access-key', 'your-store-id', { test: true });
```


## Functions

### initCheckout
Initialize a Checkout

```javascript

    let checkoutData = {
        redirectPageUri: 'https://your-redirect-url.com',
        merchantTermsUri: 'https://your-terms-url.com',
        notificationUri: 'https://your-notifications-url.com',
        reference: '123',
        cart: {
            items:[
                {
                    id: '111',
                    description: 'Product 1',
                    unitPrice: 100,
                    vat: 25,
                    quantity: 2
                }
            ]
        }
    };

    // Old school Promise method
    collectorCheckout.initCheckout(checkoutData).then(result => {
        // Handle result         
    }).catch(error => {
        // Handle error
    });


    // New ES8 method
    try
    {
        let result = await collectorCheckout.initCheckout();
        // Handle result
    }
    catch(error)
    {
        // Handle error
    }
```


### updateCart
Update the cart

```javascript
    let privateId; // Id acquired from initCheckout
    let updatedCart = {
        items: [
            {
                id: '111',
                description: 'Product 2',
                unitPrice: 100,
                vat: 25,
                quantity: 1
            }
        ]
    };

    // Old school Promise method
    collectorCheckout.updateCart(privateId, updatedCart).then(result => {
        // Handle result         
    }).catch(error => {
        // Handle error
    });


    // New ES8 method
    try
    {
        let result = await collectorCheckout.updateCart(privateId, updatedCart);
        // Handle result
    }
    catch(error)
    {
        // Handle error
    }

```


### updateFees
Update the fees

```javascript
    let privateId; // Id acquired from initCheckout
    let updatedFees = {
        shipping: {
            id: 'shipping-cost',
            description: 'Shipping fee',
            unitPrice: 10,
            var: 2.5
        }
    }


    // Old school Promise method
    collectorCheckout.updateFees(privateId, updatedFees).then(result => {
        // Handle result         
    }).catch(error => {
        // Handle error
    });


    // New ES8 method
    try
    {
        let result = await collectorCheckout.updateFees(privateId, updatedFees);
        // Handle result
    }
    catch(error)
    {
        // Handle error
    }

```


### updateReference
Update the reference

```javascript
    let privateId; // Id acquired from initCheckout


    // Old school Promise method
    collectorCheckout.updateReference(privateId, 'New reference').then(result => {
        // Handle result         
    }).catch(error => {
        // Handle error
    });


    // New ES8 method
    try
    {
        let result = await collectorCheckout.updateReference(privateId, 'New reference');
        // Handle result
    }
    catch(error)
    {
        // Handle error
    }

```

### getScriptTag
Used to get the client script tag with the correct attributes

```javascript
    let publicToken; // Public token acquired from initCheckout
    let data = {
            publicToken: publicToken,
            padding: false,             // Optional
            id: 'checkout-iframe',      // Optional 
            actionColor: '#004500'      // Optional
    }

    let scriptTagHtml = collectorCheckout.getScriptTag(data);
    // Put scriptTagHtml in the client HTML where you want the checkout iframe to be rendered
```

## Authors

* **Emil Isaksson** - *Creator* - [emilisaksson](https://github.com/emilisaksson)
[KA50.se](https://ka50.se)
[emilisaksson.se](https://emilisaksson.se)


## License

This project is licensed under the GNU General Public License - see the [LICENSE.md](LICENSE.md) file for details

