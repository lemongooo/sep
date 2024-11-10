// src/test/AdministrationManager.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import AdministrationManager from "../components/AdministrationManager";
import { AuthProvider } from "../context/AuthContext";

// Mock functions
const mockUpdateRequestStatus = jest.fn();

beforeEach(() => {
  mockUpdateRequestStatus.mockClear();
});

test("renders Administration Manager component", () => {
  const requests = [
    {
      requestId: "REQ001",
      clientName: "Client A",
      eventType: "Conference",
      status: "Commented by FM",
      comment: "Approved with conditions",
    },
  ];

  render(
    <AuthProvider>
      <AdministrationManager
        requests={requests}
        updateRequestStatus={mockUpdateRequestStatus}
      />
    </AuthProvider>
  );

  // Verify the component renders with the request data
  expect(
    screen.getByText(/Administration Manager - Review Requests/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/Client A/i)).toBeInTheDocument();
  expect(screen.getByText(/Conference/i)).toBeInTheDocument();
  expect(screen.getByText(/Commented by FM/i)).toBeInTheDocument();
  expect(screen.getByText(/Approved with conditions/i)).toBeInTheDocument();
});

test("updates request status after review", () => {
  const requests = [
    {
      requestId: "REQ001",
      clientName: "Client A",
      eventType: "Conference",
      status: "Commented by FM",
      comment: "Approved with conditions",
    },
  ];

  render(
    <AuthProvider>
      <AdministrationManager
        requests={requests}
        updateRequestStatus={mockUpdateRequestStatus}
      />
    </AuthProvider>
  );

  // Click to approve the request
  fireEvent.click(screen.getByText(/Approve/i));
  expect(mockUpdateRequestStatus).toHaveBeenCalledWith(
    "REQ001",
    "Approved by Administration"
  );

  // Click to reject the request
  fireEvent.click(screen.getByText(/Reject/i));
  expect(mockUpdateRequestStatus).toHaveBeenCalledWith(
    "REQ001",
    "Rejected by Administration"
  );
});
