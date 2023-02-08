import { useRef, useState } from "react";
import { Input, InputCount } from "../../../components";
import LocalStorageAdapter from "../../../infra/LocalStorageAdapter";
import { Product } from "../../App";
import styles from "./styles.module.scss";

interface Props {
  productList: Product[];
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function Form({ productList, setProductList }: Props) {
  const [nameProduct, setNameProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleChangeProduct(e: React.ChangeEvent<HTMLInputElement>) {
    const newNameProduct = e.target.value;
    setNameProduct(newNameProduct);
  }

  function handleChangeQuantity(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuantity = Number(e.target.value);
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  }

  function handleMoreQuantity() {
    setQuantity(quantity + 1);
  }

  function handleLessQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const product = {
      name: nameProduct,
      quantity: quantity,
      isChecked: false,
      price: "R$ 0,00",
    };

    if (productList.some((product) => product.name === nameProduct)) {
      const productIndex = productList.findIndex(
        (product) => product.name === nameProduct
      );
      const newProductList = [...productList];
      newProductList[productIndex].quantity += quantity;
      setProductList(newProductList);
    } else {
      setProductList([...productList, product]);
    }

    setNameProduct("");
    setQuantity(1);
    inputRef.current?.focus();
    window.scrollTo(0, document.body.scrollHeight);
    const storage = new LocalStorageAdapter();
    storage.set("@ShopList/products", [...productList, product]);
  }

  return (
    <section>
      <form onSubmit={submitForm}>
        <div className={styles.field}>
          <label>Produto</label>
          <Input
            value={nameProduct}
            onChange={handleChangeProduct}
            autoFocus
            inputRef={inputRef}
          />
        </div>
        <div className={styles.field}>
          <label>Quantidade</label>
          <InputCount
            quantity={quantity}
            moreQuantity={handleMoreQuantity}
            lessQuantity={handleLessQuantity}
            onChange={handleChangeQuantity}
          />
        </div>
        <button
          className={styles.buttonForm}
          disabled={nameProduct.trim().length < 1}
        >
          Adicionar
        </button>
      </form>
    </section>
  );
}
