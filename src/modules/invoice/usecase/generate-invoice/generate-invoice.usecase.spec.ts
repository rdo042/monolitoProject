import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/entity/product.entity";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate Invoice Usecase unit test", () => {
  it("should add a invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const item1 = new Product({id: new Id('1'), name: 'Product 1', price: 10});
    const item2 = new Product({id: new Id('2'), name: 'Product 2', price: 20});
    const products = [item1, item2];

    const input = {
      name: 'Client 1',
      document: '10',
      street: 'Street 1',
      number: '1',
      complement: 'APTO 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345',
      items: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        price: product.price
      })),
    }

    const result = await usecase.execute(input);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number.toString());
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
    expect(result.total).toEqual(30);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Product 1");
    expect(result.items[0].price).toBe(10);
    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("Product 2");
    expect(result.items[1].price).toBe(20);

  });

  
});
