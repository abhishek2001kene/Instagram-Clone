const asyncHandler = (reqHandler) => {         // Higher-order function to handle async request handlers
    return (req, res, next) => {                  // Wrap the request handler in a Promise.
        Promise.resolve(reqHandler(req, res, next))
        .catch((err) => next(err))                // Pass any errors to the next middleware for centralized error handling.
    }
    }
    
    export {asyncHandler}
    
    