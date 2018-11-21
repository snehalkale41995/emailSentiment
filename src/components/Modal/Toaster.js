import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toaster(message, error) {
  if (error) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  } else {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  }
}
