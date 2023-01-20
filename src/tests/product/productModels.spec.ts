import ProductModel from "../../models/product.model";
import Product from "../../types/product.types";

const productModel = new ProductModel();

describe("product models test", (): void => {
  let product: Product;
  it("create product models", async (): Promise<void> => {
    product = await productModel.create({
      name: "product1",
      price: 150,
    });
    expect(product.id).toBeTruthy();
  });

  it("get all products ", async (): Promise<void> => {
    expect((await productModel.getAllProduct()).length).toBeGreaterThan(0);
  });

  it("get one product models", async (): Promise<void> => {
    expect(await productModel.getOneProduct(product.id as string)).toEqual(
      product
    );
  });

  it("get products by category", async (): Promise<void> => {
    expect(
      (await productModel.filter(product.category as string)).length
    ).toBeGreaterThan(0);
  });

  it("update product by id", async (): Promise<void> => {
    const updatedProducts = await productModel.updateOneProduct(
      {
        category: "category",
      } as Product,
      product.id as string
    );

    expect(updatedProducts.category).toEqual("category");
  });
  it(" top ten proucts ", async () => {
    const top = await productModel.getTop("10");
    expect(top.length).toBeGreaterThan(0);
  });
  it("delete product by id", async (): Promise<void> => {
    expect(await productModel.deleteOneProduct(product.id as string)).toEqual({
      ...product,
      category: "category",
    });
  });
});
