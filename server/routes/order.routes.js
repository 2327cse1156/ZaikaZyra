import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { acceptOrder, getAssignment, getCurrentOrder, getMyOrders, placeOrder, updateOrderStatus } from "../controllers/order.controller.js";

const orderRouter = express.Router()

orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.get("/my-orders",isAuth,getMyOrders);
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus);
orderRouter.get("/get-assignment",isAuth,getAssignment)
orderRouter.get("/accept-order/:assignmentId",isAuth,acceptOrder)
orderRouter.get("/get-current-order",isAuth,getCurrentOrder)
export default orderRouter;