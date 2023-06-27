import BaseEntity from "../../../@shared/domain/entity/base.entity";
import NotificationError from "../../../@shared/domain/notification/notitication.error";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceProductValidatorFactory from "../../factory/invoice-product.validator.factory";

type ProductProps = {
  id?: Id;
  name: string;
  price: number;
};

export default class Product extends BaseEntity {
  private _name: string;
  private _price: number;
  
  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
    this._price = props.price;

    this.validate();

    if (this.notification.hasErrors()) {
        throw new NotificationError(this.notification.getErrors());
    }
  }

  validate() {
    InvoiceProductValidatorFactory.create().validate(this);
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

}
