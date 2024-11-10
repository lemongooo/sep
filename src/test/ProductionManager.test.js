// src/test/ProductionManager.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import ProductionManager from "../components/ProductionManager";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

// Mock functions
const mockAddHRRequest = jest.fn();
const mockAddBudgetRequest = jest.fn();

beforeEach(() => {
  mockAddHRRequest.mockClear();
  mockAddBudgetRequest.mockClear();
});

// Test 1: Renders ProductionManager component with HR and Budget sections
test("renders ProductionManager component with HR and Budget sections", () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <ProductionManager
          requests={[
            { id: "REQ001", clientName: "Client A", eventType: "Conference" },
          ]}
          addHRRequest={mockAddHRRequest}
          hrRequests={[]}
          addBudgetRequest={mockAddBudgetRequest}
          budgetRequests={[]}
        />
      </BrowserRouter>
    </AuthProvider>
  );

  expect(screen.getByText(/Staff Recruitment Request/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Budget Request/i)[0]).toBeInTheDocument();
});

// Test 2: Submits a new HR request using created request data
test("submits a new HR request and clears form", () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <ProductionManager
          requests={[
            { id: "REQ001", clientName: "Client A", eventType: "Conference" },
          ]}
          addHRRequest={mockAddHRRequest}
          hrRequests={[]}
          addBudgetRequest={mockAddBudgetRequest}
          budgetRequests={[]}
        />
      </BrowserRouter>
    </AuthProvider>
  );

  // Fill out HR form fields
  fireEvent.change(screen.getByLabelText(/Select Request ID:/i), {
    target: { value: "REQ001" },
  });
  fireEvent.change(screen.getByLabelText(/Number of Staff Required:/i), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByLabelText(/Responsibilities:/i), {
    target: { value: "Manage team operations" },
  });
  fireEvent.change(screen.getByLabelText(/Time Frame:/i), {
    target: { value: "Q4 2023" },
  });

  // Submit HR request form
  fireEvent.click(screen.getByText(/Submit HR Request/i));

  // Verify that addHRRequest was called with the correct data
  expect(mockAddHRRequest).toHaveBeenCalledWith({
    requestId: "REQ001",
    staffCount: "5",
    responsibilities: "Manage team operations",
    timeFrame: "Q4 2023",
    status: "Submitted",
  });

  // Verify form fields are cleared
  expect(screen.getByLabelText(/Select Request ID:/i).value).toBe("");
  expect(screen.getByLabelText(/Number of Staff Required:/i).value).toBe("");
  expect(screen.getByLabelText(/Responsibilities:/i).value).toBe("");
  expect(screen.getByLabelText(/Time Frame:/i).value).toBe("");
});

// Test 3: Submits a new Budget request using created request data
test("submits a new Budget request and clears form", () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <ProductionManager
          requests={[
            { id: "REQ001", clientName: "Client A", eventType: "Conference" },
          ]}
          addHRRequest={mockAddHRRequest}
          hrRequests={[]}
          addBudgetRequest={mockAddBudgetRequest}
          budgetRequests={[]}
        />
      </BrowserRouter>
    </AuthProvider>
  );

  // Fill out Budget form fields
  fireEvent.change(screen.getByLabelText(/Select Request ID:/i), {
    target: { value: "REQ001" },
  });
  fireEvent.change(screen.getByLabelText(/Budget Amount:/i), {
    target: { value: "8000" },
  });
  fireEvent.change(screen.getByLabelText(/Reason for Budget:/i), {
    target: { value: "Event coordination" },
  });

  // Submit Budget request form
  fireEvent.click(screen.getByText(/Submit Budget Request/i));

  // Verify that addBudgetRequest
  expect(mockAddBudgetRequest).toHaveBeenCalledWith({
    requestId: "REQ001",
    amount: "8000",
    reason: "Event coordination",
    status: "Pending",
  });

  // Verify form fields are cleared
  expect(screen.getByLabelText(/Select Request ID:/i).value).toBe("");
  expect(screen.getByLabelText(/Budget Amount:/i).value).toBe("");
  expect(screen.getByLabelText(/Reason for Budget:/i).value).toBe("");
});
