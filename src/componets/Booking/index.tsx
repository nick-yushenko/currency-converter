import React, { useEffect, useState } from "react";
import Layout from "@/ui/Layout";
import Title from "@/ui/Title";
import {
  container,
  formItem,
  info,
  loader,
  safe,
  submit,
  toggle,
} from "@/componets/Booking/style";
import Input from "@/ui/Input";
import Toggle from "@/ui/Toggle";
import Dropdown, { DropdownOption } from "@/ui/Dropdown";
import CustomCurrencySelect from "@/ui/CustomCurrencySelect";
import { Icon } from "@/ui/Icon";
import Checkbox from "@/ui/Checkbox";
import clx from "classnames";
import { Currency } from "@/store/currencies/types";
import { Customer, customerTypes } from "@/store/customer/types";
import Loader from "@/ui/Loader";

type TProps = {
  onSubmit: (customer: Customer) => void;
  currencies: Currency[];
  offices: DropdownOption[];
  loading: boolean;
};
const Booking: React.FC<TProps> = ({
  onSubmit,
  currencies,
  offices,
  loading,
}) => {
  const [customerType, setCustomerType] = useState<number>(customerTypes.buyer);
  const [name, setName] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [place, setPlace] = useState<DropdownOption>();
  const [isAgree, setIsAgree] = useState<boolean>(true);

  const [isValid, setIsValid] = useState<boolean>(false);

  const [isNameError, setIsNameError] = useState<boolean>(false);
  const [isPhoneError, setIsPhoneError] = useState<boolean>(false);
  const [isAmountError, setIsAmountError] = useState<boolean>(false);
  const [isPlaceError, setIsPlaceError] = useState<boolean>(false);
  const [isAgreeError, setIsAgreeError] = useState<boolean>(false);

  const validate = () => {
    let isValid = true;
    if (!isAgree) isValid = false;
    if (!name || name.length < 2 || name.length > 10) isValid = false;
    if (!phone || phone.length !== 12) isValid = false;
    if (!amount || isNaN(Number(amount)) || Number(amount) === 0)
      isValid = false;
    if (!place) isValid = false;
    if (!currency?.value) isValid = false;

    return isValid;
  };

  const onChangePlace = (val: any, meta: object) => {
    setPlace(val);
  };

  const onChangeCurrency = (val: any, meta: object) => {
    setCurrency(val);
  };

  const onChangeAmount = (val: string) => {
    setAmount(val);
  };

  const onChangePhone = (val: string) => {
    setPhone(val.replace(/[^\+\d]/g, ""));
  };
  const onChangeName = (val: string) => {
    setName(val);
  };
  const onSubmitHandler = () => {
    const obj: Customer = {
      name: name ?? "",
      phone: phone ?? "",
      customer_type: customerType,
      currency_id: currency.id,
      amount: amount ?? "",
      address_id: place?.id ?? 0,
      user_aggrement: isAgree ? 1 : 0,
    };

    if (validate()) onSubmit(obj);
    else {
      setIsNameError(true);
      setIsPhoneError(true);
      if (!amount || isNaN(Number(amount)) || Number(amount) === 0)
        setIsAmountError(true);
      !place && setIsPlaceError(true);
      !isAgree && setIsAgreeError(true);
    }
  };

  useEffect(() => {
    setIsValid(validate());
  }, [customerType, name, phone, place, amount, currency, isAgree]);

  useEffect(() => {
    if (currencies.length) setCurrency(currencies[0]);
  }, [currencies]);

  return (
    <Layout.Container>
      <Title.H2>Резервирование валюты</Title.H2>

      {loading ? (
        <div className={loader}>
          <Loader loadingText={"Подождите, идет загрузка"} />
        </div>
      ) : (
        <>
          <Toggle
            styles={toggle}
            onChange={val => {
              setCustomerType(val ? customerTypes.seller : customerTypes.buyer);
            }}
          />
          <div className={container}>
            <div className={formItem}>
              <Input
                placeholder={"Имя*"}
                minLength={2}
                maxLength={10}
                required
                onChange={onChangeName}
                isError={isNameError}
              />
            </div>

            <div className={formItem}>
              <Input
                type={"phone"}
                placeholder={"Телефон*"}
                required
                onChange={onChangePhone}
                isError={isPhoneError}
              />
            </div>

            <div className={formItem}>
              <CustomCurrencySelect
                options={currencies}
                onChange={onChangeCurrency}
                onChangeAmount={onChangeAmount}
                isError={isAmountError}
              />
            </div>

            <div className={formItem}>
              <Dropdown
                options={offices}
                onChange={onChangePlace}
                isError={isPlaceError}
              />
            </div>
          </div>

          <div
            onClick={onSubmitHandler}
            className={clx(submit, !isValid && "disabled")}
          >
            Оставить заявку
          </div>

          <div className={info}>
            <Checkbox
              isError={isAgreeError}
              label={
                <>
                  Я согласен с{" "}
                  <a
                    href={process.env.VITE_APP_PRIVACY_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    условиями передачи и обработки данных
                  </a>
                </>
              }
              onChange={val => {
                setIsAgreeError(false);
                setIsAgree(val);
              }}
              checked={isAgree}
            />
            <div className={safe}>
              <Icon name={"safe-icon"} />
              <span>Гарантируем безопасность данных</span>
            </div>
          </div>
        </>
      )}
    </Layout.Container>
  );
};

export default Booking;
