using my.bookshop from '../db/schema';

service Stats{
    @readonly
    entity OrderInfo as projection on bookshop.Orders excluding{
        ceatedAt,
        createdBy,
        modifiedAt,
        modifiedBy,
        book
    }
}