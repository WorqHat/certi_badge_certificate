import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserDetails = {
  name: string;
  email: string;
};

const AdminHome = () => {
  const [userDetails, setUserDetails] = useState<UserDetails[]>([
    { name: "", email: "" },
  ]);

  const addNewUser = () => {
    setUserDetails([...userDetails, { name: "", email: "" }]);
  };

  const handleInputChange = (
    index: number,
    field: keyof UserDetails,
    value: string
  ) => {
    const updatedUserDetails = [...userDetails];
    updatedUserDetails[index][field] = value;
    setUserDetails(updatedUserDetails);
  };

  const deleteUser = (index: number) => {
    const updatedUserDetails = userDetails.filter((_, i) => i !== index);
    setUserDetails(updatedUserDetails);
  };

  const handleSubmit = () => {
    console.log("User Details:", userDetails);
    // Add your submission logic here
  };

  return (
    <div className="h-full">
      <div className="flex flex-col items-center justify-center h-full p-12 bg-neutral-100 rounded-lg">
        <h1 className="text-2xl font-bold mb-8">Add Certificate Details</h1>
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="issue-date">Issue Date</Label>
            <Input type="date" id="issue-date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input type="date" id="expiry-date" />
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="context">Context</Label>
            <Input type="text" id="context" placeholder="Enter context" />
          </div>
          <div className="space-y-2 ">
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" placeholder="Enter title" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-full p-12 bg-neutral-100 rounded-lg">
        <div className="flex justify-between items-center space-x-96 border-b pb-12">
          <div>
            <h1 className="text-2xl font-bold ">Add User Details</h1>
          </div>

          <div>
            <Label
              htmlFor="upload-user-csv"
              className="cursor-pointer bg-neutral-950 dark:bg-white px-2 py-3 rounded-lg text-white dark:text-black"
            >
              Upload CSV
            </Label>
            <Input type="file" id="upload-user-csv" className="hidden" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {userDetails.map((user, index) => (
            <div key={index} className="col-span-2 space-y-2">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor={`name-${index}`}>Name</Label>
                  <Input
                    type="text"
                    id={`name-${index}`}
                    placeholder="Enter name"
                    value={user.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor={`email-${index}`}>Email</Label>
                  <Input
                    type="email"
                    id={`email-${index}`}
                    placeholder="Enter email"
                    value={user.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="destructive"
                    className="mt-6"
                    onClick={() => deleteUser(index)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="col-span-2">
            <Button
              variant="outline"
              className="w-full mt-4 shadow-md"
              onClick={addNewUser}
            >
              +
            </Button>
          </div>
          <div className="col-span-2">
            <Button
              type="submit"
              className="w-full mt-4"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
