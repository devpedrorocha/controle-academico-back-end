import actionControll from "../management/actionsController.js";
import classControll from "../management/classController.js";
import subjectControll from "../management/subjectsController.js";
import enrolledControll from "../management/enrolledClassControler.js";
import roleControll from "../management/roleControll.js";
import userControll from "../management/userController.js";

class AdminController {
    static actionControll = actionControll;
    static roleControll = roleControll;
    static subjectControll = subjectControll;
    static classControll = classControll;
    static userControll = userControll;
    static enrolledControll = enrolledControll;
}

export default AdminController;