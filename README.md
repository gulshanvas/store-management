

## Prerequites
1. Node >= 11.12.0
2. `json-auth-server` and `json-server` package to be installed globally.
3. MySql >= 5.7


## Steps to run:

1. Run below command to create database :
    ```
    create database store_management
    ```

2. npm install
3. npm run setup
4. npm run auth-module
5. npm run invertory-module
6. import postman api's under postman folder


Note: 
1. It allows to create products by user having manager role.
2. It allows to create order for products
3. It helps the store manager to manage inventory at store and facilitates returning of product.
4. It interacts with mocked centralized inventory module and auth module.






