import * as yup from "yup";
import ValidatorInterface from "../../@shared/validator/validator.interface";
import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";


export default class InvoiceProductYupValidator implements ValidatorInterface<Product>
{
    validate(entity: Product): void {

        try {

            yup
            .object()
            .shape({
                name: yup.string().required("Name is required"),
            })
            .validateSync(
                {
                    name: entity.name,
                },
                {
                    abortEarly: false,
                }
            );
        } catch(errors) {
            const e = errors as yup.ValidationError;
            e.errors.forEach((error) => {
                entity.notification.addError({
                    context: "invoice",
                    message: error,
                })
            })
        }
    }   
}