import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import InvoiceRepository from "./invoice.repository";
import Address from "../domain/value-object/address";
import Product from "../domain/entity/product.entity";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";


describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a Invoice", async () => {
    
    const address = new Address('Street 1', 1, 'Complement 1', 'City 1', 'State 1', '111111');
    const item1 = new Product({id: new Id('1'), name: 'Product 1', price: 10});
    const item2 = new Product({id: new Id('2'), name: 'Product 2', price: 20});

    const products = [item1, item2];

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Client 1",
      document: "123",
      address: address,
      items: products,
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({ 
      where: { id: invoice.id.id },
      include: ["items"],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toBe(invoice.id.id);
    expect(invoiceDb.name).toBe(invoice.name);
    expect(invoiceDb.document).toBe(invoice.document);
    expect(invoiceDb.street).toBe(invoice.address.street);
    expect(invoiceDb.number).toBe(invoice.address.number);
    expect(invoiceDb.complement).toBe(invoice.address.complement);
    expect(invoiceDb.state).toBe(invoice.address.state);
    expect(invoiceDb.city).toBe(invoice.address.city);
    expect(invoiceDb.zipcode).toBe(invoice.address.zipcode);
    expect(invoiceDb.items.length).toBe(2);
    expect(invoiceDb.items[0].id).toBe("1");
    expect(invoiceDb.items[0].name).toBe("Product 1");
    expect(invoiceDb.items[0].price).toBe(10);
    expect(invoiceDb.items[1].id).toBe("2");
    expect(invoiceDb.items[1].name).toBe("Product 2");
    expect(invoiceDb.items[1].price).toBe(20);

  });

  it("should find a invoice", async () => {
    const address = new Address('Street 1', 1, 'Complement 1', 'City 1', 'State 1', '111111');
    const item1 = new Product({id: new Id('1'), name: 'Product 1', price: 10});
    const item2 = new Product({id: new Id('2'), name: 'Product 2', price: 20});

    const products = [item1, item2];

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Client 1",
      document: "123",
      address: address,
      items: products,
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await repository.find(invoice.id.id);

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id.id).toBe(invoice.id.id);
    expect(invoiceDb.name).toBe(invoice.name);
    expect(invoiceDb.document).toBe(invoice.document);
    expect(invoiceDb.address.street).toBe(invoice.address.street);
    expect(invoiceDb.address.number).toBe(invoice.address.number);
    expect(invoiceDb.address.complement).toBe(invoice.address.complement);
    expect(invoiceDb.address.state).toBe(invoice.address.state);
    expect(invoiceDb.address.city).toBe(invoice.address.city);
    expect(invoiceDb.address.zipcode).toBe(invoice.address.zipcode);
    expect(invoiceDb.createdAt).not.toBeNull();
    expect(invoiceDb.updatedAt).not.toBeNull();
    
    expect(invoiceDb.items[0].id.id).toBe("1");
    expect(invoiceDb.items[0].name).toBe("Product 1");
    expect(invoiceDb.items[0].price).toBe(10);
    expect(invoiceDb.items[1].id.id).toBe("2");
    expect(invoiceDb.items[1].name).toBe("Product 2");
    expect(invoiceDb.items[1].price).toBe(20);
  });
});
