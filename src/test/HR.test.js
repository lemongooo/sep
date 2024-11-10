// src/test/HR.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import HR from "../components/HR";
import { AuthProvider } from "../context/AuthContext";

// Mock function for updating the status
const mockUpdateHRRequestStatus = jest.fn();

beforeEach(() => {
  mockUpdateHRRequestStatus.mockClear();
});

test("renders HR component and displays HR requests", () => {
  const hrRequests = [
    {
      requestId: "REQ001",
      staffCount: 5,
      responsibilities: "Manage team operations",
      timeFrame: "Q4 2023",
      status: "Submitted",
    },
    {
      requestId: "REQ002",
      staffCount: 3,
      responsibilities: "Assist with project",
      timeFrame: "Q1 2024",
      status: "Pending",
    },
  ];

  render(
    <AuthProvider>
      <HR
        hrRequests={hrRequests}
        updateHRRequestStatus={mockUpdateHRRequestStatus}
      />
    </AuthProvider>
  );

  // Check if HR requests are displayed
  expect(screen.getByText(/HR Requests/i)).toBeInTheDocument();
  expect(screen.getByText(/REQ001/i)).toBeInTheDocument();
  expect(screen.getByText(/Manage team operations/i)).toBeInTheDocument();
  expect(screen.getByText(/Q4 2023/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Submitted/i)[0]).toBeInTheDocument();
  expect(screen.getByText(/REQ002/i)).toBeInTheDocument();
  expect(screen.getByText(/Assist with project/i)).toBeInTheDocument();
  expect(screen.getByText(/Q1 2024/i)).toBeInTheDocument();
  expect(screen.getByText(/Pending/i)).toBeInTheDocument();
});

test("allows status change for HR requests", () => {
  const hrRequests = [
    {
      requestId: "REQ001",
      staffCount: 5,
      responsibilities: "Manage team operations",
      timeFrame: "Q4 2023",
      status: "Submitted",
    },
  ];

  render(
    <AuthProvider>
      <HR
        hrRequests={hrRequests}
        updateHRRequestStatus={mockUpdateHRRequestStatus}
      />
    </AuthProvider>
  );

  const statusDropdown = screen.getByDisplayValue(/Submitted/i);
  expect(statusDropdown).toBeInTheDocument();

  fireEvent.change(statusDropdown, { target: { value: "Approved" } });
  expect(mockUpdateHRRequestStatus).toHaveBeenCalledWith(0, "Approved");
});
