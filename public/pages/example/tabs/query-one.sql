---toml
title = "Daily FooBar Problem list"
description = "This is a markdown _enabled_ subtext. You can [make](https://google.com) links"
freezeColumns = 1
search = "simple"
dbUrl = "/db.sqlite"
---

select * from Invoice
join  Customer on Customer.CustomerId = Invoice.CustomerId
