namespace my.bookshop;
using { Country, managed } from '@sap/cds/common';
using { Attachments } from '@cap-js/attachments';


aspect CustomAttachments {
    file_url : String;
    // Add other properties as needed
}

entity Books {
    key ID : Integer;
    title  : localized String;
    author : Association to Authors;
    stock  : Integer;
    attachments: Composition of many CustomAttachments;
    status : localized String;
    active_status : localized String;
    active : localized String;
}

entity Sales {
    key ID : UUID;
    item_id : Integer;
    sold_by : Integer;
    sale_time: DateTime;
}

entity Authors {
  key ID : Integer;
  name   : String;
  books  : Association to many Books on books.author = $self;
}

entity Orders : managed {
  key ID  : UUID;
  book    : Association to Books;
  country : Country;
  amount  : Integer;
}


entity users {
  key ID : UUID;
  username  : localized String;
  password : localized String;
  name  : localized String;
}