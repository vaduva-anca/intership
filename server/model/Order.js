class Order {
    constructor(orderId, customerName, bookTitle, price, quantity,totalNumberOfPages) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.bookTitle = bookTitle;
        this.price = price;
        this.quantity = quantity;
        this.totalNumberOfPages= totalNumberOfPages;
    }
}

module.exports = Order;