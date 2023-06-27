import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    
    const addressInt = new Address(input.street, Number(input.number), input.complement, input.city, 
      input.state, input.zipCode);
    
    const items = input.items.map((item) => {
      return new Product({
        id: new Id(item.id),
        name: item.name,
        price: Number(item.price),
      });
    });

    const props = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      document: input.document,
      address: addressInt,
      items: items,
    };

    const invoice = new Invoice(props);
    this._invoiceRepository.generate(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number.toString(),
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((product) => ({
        id: product.id.id,
        name: product.name,
        price: product.price
      })),
      total: invoice.total(),
    };
  }
}
