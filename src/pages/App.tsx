import styles from "./App.module.scss";
import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/header";
import { Form } from "./components/form";
import { TrashIcon } from "../assets/trashIcon";
import { Input, InputCount } from "../components";
import { moneyInputFormat, moneyInputFormatToFloat } from "../utils/inputMoney";
import LocalStorageAdapter from "../infra/LocalStorageAdapter";
import logo from "../assets/logo.png";

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

  useEffect(() => {
    let deferredPrompt: any;
    const containerButton = document.getElementById("container-button");
    const addButton = document.getElementById("add-button");
    const cancelButton = document.getElementById("cancel-button");

    if (containerButton && addButton && cancelButton) {
      containerButton.style.display = "none";

      window.addEventListener("beforeinstallprompt", (e) => {
        console.log("service work on beforeinstallprompt");
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        containerButton.style.display = "flex";

        addButton.addEventListener("click", (e) => {
          // hide our user interface that shows our A2HS button
          containerButton.style.display = "none";
          // Show the prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the prompt");
            } else {
              console.log("User dismissed the prompt");
            }
            deferredPrompt = null;
          });
        });
      });

      cancelButton.addEventListener("click", (e) => {
        containerButton.style.display = "none";
      });
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
                    pattern="[0-9]*"
                    inputMode="numeric"
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

      <div id="container-button" className={styles.addButton}>
        <div className={styles.infoButton}>
          <img src={logo} alt="logo-shop-list" />
          <span>Instalar ShopList - React</span>
          <div>
            <button id="add-button">Instalar</button>
            <button id="cancel-button" className={styles.buttonVariant}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
