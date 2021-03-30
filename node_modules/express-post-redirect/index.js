
module.exports = function(request, response, next) {
    if (request.method == 'POST') {
        response.finalize = function(data) {
            if (request.query.redirect) {
                response.redirect(request.query.redirect);
            }
            else {
                response.send(data);
            }
        }
    }
    next();
}
