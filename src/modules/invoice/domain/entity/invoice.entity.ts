import BaseEntity from "../../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address";
import Product from "./product.entity";
import NotificationError from "../../../@shared/domain/notification/notitication.error";
import InvoiceValidatorFactory from "../../factory/invoice.validator.factory";

type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: Product[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: Product[];

  constructor(props: InvoiceProps) {
    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;

    this.validate();

    if (this.notification.hasErrors()) {
        throw new NotificationError(this.notification.getErrors());
    }
  }

  validate() {
    InvoiceValidatorFactory.create().validate(this);
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): Product[] {
    return this._items;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
}
}
