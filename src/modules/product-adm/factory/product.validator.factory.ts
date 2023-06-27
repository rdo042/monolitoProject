import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../domain/product.entity";
import ProductYupValidator from "../validator/product.yup.validator";

export default class ProductValidatorFactory {
    static create(): ValidatorInterface<Product> {
        return new ProductYupValidator();
    }
}