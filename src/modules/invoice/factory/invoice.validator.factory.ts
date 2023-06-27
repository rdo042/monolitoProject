import ValidatorInterface from "../../@shared/validator/validator.interface";
import Invoice from "../domain/entity/invoice.entity";
import InvoiceYupValidator from "../validator/invoice.yup.validator";

export default class InvoiceValidatorFactory {
    static create(): ValidatorInterface<Invoice> {
        return new InvoiceYupValidator();
    }
}