import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address("Street 1", 1,"APTO 101","City 1","State 1","111");

const product1 = new Product({
  id: new Id("1"),
  name: "Product 1",
  price: 10,
});

const product2 = new Product({
  id: new Id("2"),
  name: "Product 2",
  price: 20,
});

const invoice = new Invoice({
  id: new Id("1"),
  name: "Client 1",
  document: "121",
  address: address,
  items: [product1, product2],
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice Usecase unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.number).toEqual(invoice.address.number);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.zipcode).toEqual(invoice.address.zipcode);
    expect(result.createdAt).toEqual(invoice.createdAt);
    expect(result.total).toEqual(invoice.total());
    expect(result.total).toEqual(30);
    expect(result.items[0].id).toEqual("1");
  });
});
