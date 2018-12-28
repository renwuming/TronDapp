import React, {Component} from 'react';
import './App.css';
import * as artifact from './contracts/Predict'


class App extends Component {

    constructor(props) {
        super(props);

        window.tronWeb.setDefaultBlock('latest');

        this.contract = null;
        this.state = {
            address: null,
            balance: null,
            contract: null,
            tokenBalance: null,
            result_0: null,
            result_1: null,
            result_2: null,
            
        }
    }

    async componentDidMount() {

        let tronWeb = window.tronWeb;
        console.log('address', tronWeb.defaultAddress.base58)
        this.setState({address: tronWeb.defaultAddress.base58});
        let address = tronWeb.address.fromHex(artifact.networks['*'].address);
        console.log(artifact.abi, artifact.networks['*'].address, address)
        this.contract = tronWeb.contract(artifact.abi, address);
        console.log(this.contract);
    }


    ///简介
    ///这个项目主要功能  算命～～～～～，分为爱情，事业，财富

    ///1.checkUser,用来检查用户是否以前算过，算过的话，链上有用户数据，就不需要重新输入数据
    ///            没有算过的话，就需要输入个人信息
    ///每次只能选一个算，爱情事业财富，三选一
    ///如果之前算过爱情的，再算爱情的，结果不会改变
    ///想要改变结果需要通过转运功能

    ////用户可以做的事情  1. 爱情，事业，财富   算命
    ////               2. 爱情，事业，财富   转运
    ////               3. 打赏开发者
    
    
    //checkUser检查是否有用户数据（返回true 或者 false）
    //typeid 预测的类型（1 -- 爱情， 2 -- 事业， 3 -- 财运）
    //true --- 有数据 ，调用 predict (只需要传入一个参数，typeid)
    //false -- 没有数据，调用 predictFirst （除了typeid， 还有个人信息）
    checkUser = async () => {
        let result_0 = await this.contract.checkUser().call()
        console.log(result_0)
        this.setState({checkUser:JSON.parse(result_0)})
    };

    //我的记录
    //获取用户数据
    /*
    struct User {
        uint256 userid;             //用户id
        string name;                //姓名
        uint256 sex;                //性别 0--女， 1--- 男
        uint256 birthday;           // 19990110
        uint256 luckynumber;        //6666
        uint256 type_love;          //99    -- 用分数和类型去大苏那里去文字
        uint256 type_career;        //66
        uint256 type_money;         //88
    }
    */
    getUser = async () => {
        let result_0 = await this.contract.getUser().call()
        console.log(result_0);
        this.setState({getUserkey:JSON.parse(result_0[0])})
        this.setState({getUsername:result_0[1]})
        this.setState({getUsersex:JSON.parse(result_0[2])})
        this.setState({getUserbirthday:JSON.parse(result_0[3])})
        this.setState({getUserluckynumber:JSON.parse(result_0[4])})
        this.setState({getUserlove:JSON.parse(result_0[5])})
        this.setState({getUsercareer:JSON.parse(result_0[6])})
        this.setState({getUsermoney:JSON.parse(result_0[7])})
    };


    //运势
    predict = async () => {
        //监听
        //41dbeba2b4d7e5ce37f84e6b949681316c8259a159 为合约地址，部署新合约后，需替换
        let score;
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        console.log(contractInstance)
        //监听 predictSuccess 事件
        contractInstance["predictSuccess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('Money:',res["result"]["score"]);//监听结果，为预测的分数
            score = res["result"]["score"];
            //this.setState({predict:res["result"]["score"]})
        });
        console.log("---------------------")
        //调用 合约中得predict
        let typepredict = 1 ///1是love，2是career，3是money
        let result_0 = await this.contract.predict(typepredict).call()
        console.log(result_0)
        score = JSON.parse(result_0)
        if(score == 0) {
            let result_0 = await this.contract.predictType(typepredict).send({
                feeLimit:100000000,
                callValue:0,
                shouldPollResponse:true
            })
            console.log(result_0)
        }
        this.setState({predict:score})
    };

    //第一次算运势
    predictFirst = async () => {
        //监听
        let score;
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        console.log(contractInstance)
        contractInstance["predictSuccess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('score:',res["result"]["score"]);
            score = res["result"]["score"];
        });
        console.log("---------------------")
        //调用 合约中得predictFirst
        //string _name, uint256 _sex, uint256 _birthday, uint256 _luckynumber, uint256 _type
        let name = "hahaha"
        let sex = 1
        let birthday = 19970101
        let luckynumber = 6
        let typepredict = 2 ///1是love，2是career，3是money
        let result_0 = await this.contract.predictFirst(name, sex, birthday, luckynumber,typepredict).send({
            feeLimit:100000000,
            callValue:0,
            shouldPollResponse:true
        })
        console.log(result_0)
        this.setState({predictFirst:score})
    };

    //捐赠给开发者
    donate = async () => {
        //监听
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        console.log(contractInstance)
        contractInstance["DonateSuccess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('Money:',res["result"]["money"]);
        });
        console.log("---------------------")
        let tron = 1000000
        let money = 5
        let result_0 = await this.contract.donate(money).send({
            feeLimit:100000000,
            callValue:money * tron,
            shouldPollResponse:true
        })
        console.log(result_0)
        this.setState({donate:res["result"]["money"]})
    };

    //转运
    help = async () => {
        //监听
        let score;
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("412cbec6c38a6fb76a315235c9b4989396d65de36e");
        console.log(contractInstance)
        contractInstance["predictSuccess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('score:',res["result"]["score"]);
            score = res["result"]["score"]
        });
        console.log("---------------------")
        let typeid = 1
        let result_0 = await this.contract.help(typeid).send({
            feeLimit:100000000,
            callValue:5000000,      //手续费，转运付费，5tron
            shouldPollResponse:true
        })
        console.log(result_0)
        this.setState({help:score})
    };

    //不做锦鲤榜的话，下面的getLove，getCareer，getMoney就不用了
    //爱情运势记录，typeid = 1
    //用来坐排行榜
    getLove = async () => {
        let result_0 = await this.contract.getLovekey().call()
        let users = [];
        let user;
        console.log("----------------")
        console.log(result_0)
        console.log("----------------")
        for(let i = 1; i<JSON.parse(result_0); i++) {
            console.log(i)
            user = console.log(await this.contract.getLove(i).call())
            //返回这预测的用户
            //用用户地址去取他的分数，
            users.push(user)
        }
        this.setState({getLove:users.join(",")})
    }

    //事业运势记录，typeid = 2
    getCareer = async () => {
        let result_0 = await this.contract.getCareerkey().call()
        let users = [];
        let user;
        console.log("----------------")
        console.log(result_0)
        console.log("----------------")
        for(let i = 1; i<result_0; i++) {
            console.log(i)
            console.log(await this.contract.getCareer(i).call())
            users.push(user)
        }
        this.setState({getCareer:users.join(",")})
    }

    //财富运势记录，typeid = 3
    getMoney = async () => {
        let result_0 = await this.contract.getMoneykey().call()
        let users = [];
        let user;
        console.log("----------------")
        console.log(result_0)
        console.log("----------------")
        console.log(result_0)
        for(let i = 1; i<result_0; i++) {
            console.log(i)
            console.log(await this.contract.getMoney(i).call())
            users.push(user)
        }
        this.setState({getMoney:users.join(",")})
    }



    render() {
        return (
            <div className="App">
                <div>
                    <p>current address</p>
                    <p>{this.state.address}</p>
                    <hr></hr>
                </div>

                <div>
                    <p>checkUser</p>
                    <p>{this.state.checkUser}</p>
                    <button onClick={this.checkUser}>checkUser</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getUser</p>
                    <p>id:{this.state.getUserkey}</p>
                    <p>name:{this.state.getUsername}</p>
                    <p>sex:{this.state.getUsersex}</p>
                    <p>birthday:{this.state.getUserbirthday}</p>
                    <p>luckynumber:{this.state.getUserluckynumber}</p>
                    <p>love:{this.state.getUserlove}</p>
                    <p>career:{this.state.getUsercareer}</p>
                    <p>money:{this.state.getUsermoney}</p>
                    <button onClick={this.getUser}>getUser</button>
                    <hr></hr>
                </div>

                <div>
                    <p>predict</p>
                    <p>分数：{this.state.predict}</p>
                    <button onClick={this.predict}>predict</button>
                    <hr></hr>
                </div>

                <div>
                    <p>predictFirst</p>
                    <p>分数：{this.state.predictFirst}</p>
                    <button onClick={this.predictFirst}>predictFirst</button>
                    <hr></hr>
                </div>

                <div>
                    <p>donate</p>
                    <p>捐赠金额：{this.state.donate}</p>
                    <button onClick={this.donate}>donate</button>
                    <hr></hr>
                </div>

                <div>
                    <p>help</p>
                    <p>转运后分数：{this.state.help}</p>
                    <button onClick={this.help}>help</button>
                    <hr></hr>
                </div>


                <div>
                    <p>getLove</p>
                    <p>爱情运势记录{this.state.getLove}</p>
                    <button onClick={this.getLove}>getLove</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getCareer</p>
                    <p>事业运势记录{this.state.getCareer}</p>
                    <button onClick={this.getCareer}>getCareer</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getMoney</p>
                    <p>财富运势记录{this.state.getMoney}</p>
                    <button onClick={this.getMoney}>getMoney</button>
                    <hr></hr>
                </div>


            </div>
        );
    }
}

export default App;
