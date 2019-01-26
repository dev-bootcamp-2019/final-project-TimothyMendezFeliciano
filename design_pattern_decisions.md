I chose to restrict access to certain functinos depending on the kind of user you are.
Even though you see all functions in the UI you can only use those you are allowed to.
In other words Store Owners functions are only usable by Store Owners.

And I chose to use the Circuit Breaker design pattern to stop functions like withdrawal in the case of an emergency. The toggling of an emergency can only be done by an admin.
