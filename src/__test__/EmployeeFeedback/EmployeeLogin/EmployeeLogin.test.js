import { screen , render,waitFor,fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EmployeeLogin from "../../../EmployeeFeedback/EmployeeLogin/EmployeeLogin";


const renderwithRouter =()=>{
    return render(
        <BrowserRouter>
        <EmployeeLogin/>
        </BrowserRouter>
    )
}
test("to check if heading  compoent is rendered",()=>{
    renderwithRouter()  
  
})
test("to check if heading  is rendered",()=>{
    renderwithRouter()  
    const element = screen.getByTestId(mysle)
    expect(element).toBeInTheDocument()
})

const renderWithRouter = () => { 

    return render( 

        <HashRouter> 

            <Login /> 

        </HashRouter> 

    ); 

}; 

 