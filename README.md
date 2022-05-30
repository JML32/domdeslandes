# domdeslandes

## project setup with node.js, express, sequelize with dialect mysql - MVC pattern

> including these features :
>
> - CORS
> - CSRF attacks prevention (coming soon)
> - sessions
> - reset password
> - user roles
> - mailing (via gmail services)
> - flash messages
> - Upload files
> - users keyin validations
> - backend with mysql database thru ORM Sequelize
> - pagination
> - cart & payment process (stripe) (coming soon)
> - PDF Invoices files generation thru library js pdfkit

#### **prerequisites before launching this project :**

> ##### create a .env file with the following parameters :

> ###### DB SEQUELIZE parameters :
>
> - DB_NAME =
> - DB_USER =
> - DB_PASSWORD =
> - DB_DIALECT = "mysql"
> - DB_HOST =
> - DB_PORT =

> ###### mailing parameters , mailing services provided by gmail :
>
> - MAIL_USER = gmail email's owner
> - MAIL_PWD = (password from others applications in the gmail security menu )

> ###### Stripe parameters :
>
> - STRIPE_KEY = from Stripe owner's account
