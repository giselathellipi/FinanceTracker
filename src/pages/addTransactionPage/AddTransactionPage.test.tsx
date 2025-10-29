import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddTransactionPage from "./AddTransactionPage.component";

// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock axios
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: { rates: { USD: 1, EUR: 1 } } })),
}));

describe("AddTransactionPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <AddTransactionPage />
      </BrowserRouter>
    );

  test("renders form fields correctly", async () => {
    renderComponent();

    expect(screen.getByPlaceholderText("enter_description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("enter_amount")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("select_type")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("select_category")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("select_currency")).toBeInTheDocument();
    expect(screen.getByText("submit")).toBeInTheDocument();
  });

  test("allows input changes", async () => {
    renderComponent();

    const descInput = screen.getByPlaceholderText("enter_description");
    const amountInput = screen.getByPlaceholderText("enter_amount");

    fireEvent.change(descInput, { target: { value: "Test transaction" } });
    fireEvent.change(amountInput, { target: { value: "50" } });

    expect(descInput).toHaveValue("Test transaction");
    expect(amountInput).toHaveValue(50);
  });

  test("adds transaction to localStorage on submit", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("enter_description"), { target: { value: "Test" } });
    fireEvent.change(screen.getByPlaceholderText("enter_amount"), { target: { value: "100" } });

    // Select type
    const typeDropdown = screen.getByPlaceholderText("select_type");
    fireEvent.change(typeDropdown, { target: { value: "Income" } });

    // Select category
    const categoryDropdown = screen.getByPlaceholderText("select_category");
    fireEvent.change(categoryDropdown, { target: { value: "Food" } });

    // Select currency
    const currencyDropdown = screen.getByPlaceholderText("select_currency");
    fireEvent.change(currencyDropdown, { target: { value: "USD" } });

    const submitButton = screen.getByText("submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      expect(transactions.length).toBe(1);
      expect(transactions[0].description).toBe("Test");
      expect(transactions[0].amount).toBe(100);
    });
  });

  test("alerts if required fields are missing", async () => {
    renderComponent();
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    const submitButton = screen.getByText("submit");
    fireEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith("please_fill_all_fields");

    alertMock.mockRestore();
  });
});
