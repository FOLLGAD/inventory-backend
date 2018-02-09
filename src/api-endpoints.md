# API
`/api/v1/`
## Containers

## Items

``` json
{
    "expendable": Boolean
}
```

## Auth

Header must have Base64-encoded `Basic` authorization header.
`Basic YWFhQGFhYS5jb206YWFhYWFhYQ==`

## User

``` json
{
    "ID": ID, // Microsoft ID
    "lastActivity": ISODate,
    "contactInfo": {
        "phone": "0704911775",
        "email": "cc@dd.com"
    }
}
```