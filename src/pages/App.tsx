import styles from "./App.module.scss";
import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/header";
import { Form } from "./components/form";
import { TrashIcon } from "../assets/trashIcon";
import { Input, InputCount } from "../components";
import { moneyInputFormat, moneyInputFormatToFloat } from "../utils/inputMoney";
import LocalStorageAdapter from "../infra/LocalStorageAdapter";

export interface Product {
  name: string;
  quantity: number;
  isChecked: boolean;
  price: string;
}

function App() {
  const [productList, setProductList] = useState<Product[]>([]);

  const totalPrice = useMemo(() => {
    return productList.length > 0
      ? productList
          .map((product) =>
            product.isChecked
              ? (moneyInputFormatToFloat(product.price) || 0) * product.quantity
              : 0
          )
          .reduce((a, b) => a + b)
      : 0;
  }, [productList]);

  useEffect(() => {
    const storage = new LocalStorageAdapter();
    const products = storage.get("@ShopList/products");

    if (products) {
      setProductList(products);
    }
  }, []);

  function handleCheckProduct(name: string) {
    const productIndex = productList.findIndex(
      (product) => product.name === name
    );
    const newProductList = [...productList];
    newProductList[productIndex].isChecked =
      !newProductList[productIndex].isChecked;
    setProductList(newProductList);

    const storage = new LocalStorageAdapter();
    storage.set("@ShopList/products", newProductList);
  }

  function handleMoreQuantity(name: string) {
    const productIndex = productList.findIndex(
      (product) => product.name === name
    );
    const newProductList = [...productList];
    newProductList[productIndex].quantity += 1;
    setProductList(newProductList);

    const storage = new LocalStorageAdapter();
    storage.set("@ShopList/products", newProductList);
  }

  function handleLessQuantity(name: string) {
    const productIndex = productList.findIndex(
      (product) => product.name === name
    );
    const newProductList = [...productList];
    if (newProductList[productIndex].quantity > 1) {
      newProductList[productIndex].quantity -= 1;
    }
    setProductList(newProductList);

    const storage = new LocalStorageAdapter();
    storage.set("@ShopList/products", newProductList);
  }

  function handleChangeQuantity(
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) {
    const newQuantity = Number(e.target.value);
    if (newQuantity >= 1) {
      const productIndex = productList.findIndex(
        (product) => product.name === name
      );
      const newProductList = [...productList];
      newProductList[productIndex].quantity = newQuantity;
      setProductList(newProductList);

      const storage = new LocalStorageAdapter();
      storage.set("@ShopList/products", newProductList);
    }
  }

  function handleChangePrice(
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) {
    const newPrice = e.target.value;

    if (newPrice) {
      const productIndex = productList.findIndex(
        (product) => product.name === name
      );
      const newProductList = [...productList];
      newProductList[productIndex].price = `R$ ${moneyInputFormat(newPrice)}`;
      setProductList(newProductList);

      const storage = new LocalStorageAdapter();
      storage.set("@ShopList/products", newProductList);
    }
  }

  function handleDeleteProduct(name: string) {
    const productIndex = productList.findIndex(
      (product) => product.name === name
    );
    const newProductList = [...productList];
    newProductList.splice(productIndex, 1);
    setProductList(newProductList);

    const storage = new LocalStorageAdapter();
    storage.set("@ShopList/products", newProductList);
  }

  return (
    <main>
      <div className={styles.topPage}>
        <Header />

        <Form productList={productList} setProductList={setProductList} />
      </div>

      <div className={styles.productsList}>
        {productList.length > 0 ? (
          productList.map((product) => (
            <div key={product.name} id="products-list">
              <div
                className={`${styles.product} ${
                  product.isChecked && styles.checked
                }`}
              >
                <div className={styles.box}>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckProduct(product.name)}
                    checked={product.isChecked}
                  />

                  <span>{product.name}</span>
                </div>

                <div className={styles.box2}>
                  <InputCount
                    quantity={product.quantity}
                    moreQuantity={() => handleMoreQuantity(product.name)}
                    lessQuantity={() => handleLessQuantity(product.name)}
                    onChange={(e) => handleChangeQuantity(e, product.name)}
                    disabled={product.isChecked}
                    className={product.isChecked ? styles.checked : ""}
                  />

                  <Input
                    onChange={(event) => handleChangePrice(event, product.name)}
                    width="70px"
                    value={product.price}
                    disabled={product.isChecked}
                  />

                  <div
                    role="button"
                    onClick={() =>
                      product.isChecked
                        ? null
                        : handleDeleteProduct(product.name)
                    }
                    className={`${styles.deleteButton} ${
                      product.isChecked && styles.checked
                    }`}
                  >
                    <TrashIcon />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Nenhum produto adicionado</div>
        )}
      </div>

      <div className={styles.containerPrice}>
        <strong>Total: </strong>
        <span>R$ {moneyInputFormat(String(totalPrice.toFixed(2)))}</span>
      </div>
    </main>
  );
}

export default App;
