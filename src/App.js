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


    //检查是否有用户数据
    //true --- 有数据 ，调用 predict
    //false -- 没有数据，调用 predictFirst
    checkUser = async () => {
        let result_0 = await this.contract.checkUser().call()
        console.log(result_0)
        this.setState({checkUser:JSON.parse(result_0)})
    };

    //我的记录
    getUser = async () => {
        let result_0 = await this.contract.getUser().call()
        console.log(result_0)
        let love = result_0[5].length
        let listlove = []
        for(let i = 0; i < love; i++) {
            listlove.push(JSON.parse(result_0[5][i]))
        }
        let career = result_0[6].length
        let listcareer = []
        for(let i = 0; i < career; i++) {
            listcareer.push(JSON.parse(result_0[6][i]))
        }
        let money = result_0[7].length
        let listmoney = []
        for(let i = 0; i < money; i++) {
            listmoney.push(JSON.parse(result_0[7][i]))
        }
        this.setState({getUserkey:JSON.parse(result_0[0])})
        this.setState({getUsername:result_0[1]})
        this.setState({getUsersex:JSON.parse(result_0[2])})
        this.setState({getUserbirthday:JSON.parse(result_0[3])})
        this.setState({getUserluckynumber:JSON.parse(result_0[4])})
        this.setState({getUserlove:listlove.join(",")})
        this.setState({getUsercareer:listcareer.join(",")})
        this.setState({getUsermoney:listmoney.join(",")})
    };


    //运势
    predict = async () => {
        //监听
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("41dbeba2b4d7e5ce37f84e6b949681316c8259a159");
        console.log(contractInstance)
        contractInstance["predictSuccess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('Money:',res["result"]["score"]);
            //this.setState({predict:res["result"]["score"]})
        });
        console.log("---------------------")
        //调用 合约中得predict
        let typepredict = 1 ///1是love，2是career，3是money
        let result_0 = await this.contract.predict(typepredict).send({
            feeLimit:100000000,
            callValue:0,
            shouldPollResponse:true
        })
        console.log(result_0)
        
    };

    //第一次算运势
    predictFirst = async () => {
        //监听
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("41dbeba2b4d7e5ce37f84e6b949681316c8259a159");
        console.log(contractInstance)
        contractInstance["predictSuccess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('Money:',res["result"]["score"]);
            this.setState({predictFirst:res["result"]["score"]})
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
    };

    //为他人算运势
    predictForothers = async () => {
        //监听
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("41dbeba2b4d7e5ce37f84e6b949681316c8259a159");
        console.log(contractInstance)
        contractInstance["predictSuccess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('Money:',res["result"]["score"]);
            this.setState({predictForothers:res["result"]["score"]})
        });
        console.log("---------------------")
        //调用 合约中得predict
        //string _name, uint256 _sex, uint256 _birthday, uint256 _luckynumber, uint256 _type
        let name = "hahaha"
        let sex = 1
        let birthday = 19970101
        let luckynumber = 6
        let typepredict = 2 ///1是love，2是career，3是money
        let result_0 = await this.contract.predictForothers(name, sex, birthday, luckynumber,typepredict).send({
            feeLimit:100000000,
            callValue:0,
            shouldPollResponse:true
        })
        console.log(result_0)
        
    };

    //捐赠给开发者
    donate = async () => {
        //监听
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("41dbeba2b4d7e5ce37f84e6b949681316c8259a159");
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
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("41dbeba2b4d7e5ce37f84e6b949681316c8259a159");
        console.log(contractInstance)
        contractInstance["HelpSuccess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('Money:',res["result"]["money"]);
        });
        console.log("---------------------")
        let result_0 = await this.contract.help().send({
            feeLimit:100000000,
            callValue:5000000,
            shouldPollResponse:true
        })
        console.log(result_0)
        this.setState({help:res["result"]["money"]})
    };

    //根据typeid和id获取记录
    getRecord = async () => {
        let result_0 = await this.contract.getRecord(2,1).call()
        console.log(result_0)
        this.setState({getRecordid:JSON.pares(result_0[0])})
        this.setState({getRecordscore:JSON.pares(result_0[1])})
        this.setState({getRecordowner:JSON.pares(result_0[2])})
    }

    //爱情运势记录，typeid = 1
    getLove = async () => {
        let result_0 = await this.contract.getLovekey().call()
        console.log(result_0)
        for(let i = 1; i<result_0; i++) {
            console.log(await this.contract.getRecord(1,i).call())
        }
        this.setState({getLove:result_0[0]})
    }

    //事业运势记录，typeid = 2
    getCareer = async () => {
        let result_0 = await this.contract.getCareerkey().call()
        console.log(result_0)
        for(let i = 1; i<result_0; i++) {
            console.log(await this.contract.getRecord(2,i).call())
        }
        this.setState({getCareer:JSON.pares(result_0)})
    }

    //财富运势记录，typeid = 3
    getMoney = async () => {
        let result_0 = await this.contract.getMoneykey().call()
        console.log(result_0)
        for(let i = 1; i<result_0; i++) {
            console.log(await this.contract.getRecord(3,i).call())
        }
        this.setState({getMoney:JSON.pares(result_0)})
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
                    <p>predictForothers</p>
                    <p>分数：{this.state.predictFirst}</p>
                    <button onClick={this.predictFirst}>predictFirst</button>
                    <hr></hr>
                </div>

                <div>
                    <p>donate</p>
                    <p>捐赠金额{this.state.donate}</p>
                    <button onClick={this.donate}>donate</button>
                    <hr></hr>
                </div>

                <div>
                    <p>help</p>
                    <p>转运支付的金额{this.state.help}</p>
                    <button onClick={this.help}>help</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getRecord</p>
                    <p>ID：{this.state.getRecordid}</p>
                    <p>Owner：{this.state.getRecordscore}</p>
                    <p>score{this.state.getRecordowner}</p>
                    <button onClick={this.getRecord}>getRecord</button>
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
