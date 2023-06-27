import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../domain/entity/product.entity";
import InvoiceProductYupValidator from "../validator/invoice-product.yup.validator";

export default class InvoiceProductValidatorFactory {
    static create(): ValidatorInterface<Product> {
        return new InvoiceProductYupValidator();
    }
}