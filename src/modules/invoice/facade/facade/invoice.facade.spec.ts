import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "../../repository/invoice.repository";
import GenerateInvoiceUseCase from "../../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import Product from "../../domain/entity/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceFacadeFactory from "../../factory/invoice.facade.factory";
import { InvoiceModel } from "../../repository/invoice.model";
import { ProductInvoiceModel } from "../../repository/product-invoice.model";


describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductInvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const repository = new InvoiceRepository();
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: undefined,
    });

    const item1 = new Product({id: new Id('1'), name: 'Product 1', price: 10});
    const item2 = new Product({id: new Id('2'), name: 'Product 2', price: 20});
    const products = [item1, item2];

    const input = {
      id: '1',
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

    await facade.generate(input);

    const invoice = await InvoiceModel.findOne({ 
      where: { id: input.id },
      include: ["items"],
    });


    expect(invoice).toBeDefined();
    expect(invoice.id).toBeDefined();
    expect(invoice.name).toEqual(input.name);
    expect(invoice.document).toEqual(input.document);
    expect(invoice.street).toEqual(input.street);   
    expect(invoice.complement).toEqual(input.complement);
    expect(invoice.city).toEqual(input.city);
    expect(invoice.state).toEqual(input.state);
    expect(invoice.zipCode).toEqual(input.zipCode);
   
   
  });

  it("should find a client", async () => {
    //  const repository = new InvoiceRepository();
    // const generateUsecase = new GenerateInvoiceUseCase(repository);
    // const facade = new InvoiceFacade({
    //   generateUsecase: generateUsecase,
    //   findUsecase: undefined,
    //});

    const facade = InvoiceFacadeFactory.create();

    const item1 = new Product({id: new Id('1'), name: 'Product 1', price: 10});
    const item2 = new Product({id: new Id('2'), name: 'Product 2', price: 20});
    const products = [item1, item2];

    const input = {
      id: '1',
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

    await facade.generate(input);

    const invoice = await facade.find({ id: "1" });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    
  });
});
