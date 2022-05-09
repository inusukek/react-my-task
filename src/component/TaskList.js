import React from "react";
import axios from "axios";
import eraser_icon from "../img/eraser.png";
import checkbox0 from "../img/checkbox0.png";
import checkbox1 from "../img/checkbox1.png";
import closeicon from "../img/close.png";
import sort_up from "../img/sort_up.png";
import sort_down from "../img/sort_down.png";
const baseurl = "http://127.0.0.1:8000/tasks/";

export default class TaskList extends React.Component {
  state = {
    tasks: [],
    newTasks: "",
    newSeq: 0,
    totalTask: 0,
  };

  componentDidMount() {
    axios.get(baseurl).then((res) => {
      const tasks = this.sortedData(res.data.tasks); //sort data
      this.setState({ tasks }); //set array task data
      console.log(tasks);
      this.getnewSeq(tasks);
      // console.log(this.state.newSeq);
    });
  }

  sortedData = (data) => {
    const CompleteData = data.filter((items) => items.complete);
    const unCompleteData = data.filter((items) => !items.complete);

    CompleteData.sort((a, b) => {
      return a.seq - b.seq;
    });

    unCompleteData.sort((a, b) => {
      return a.seq - b.seq;
    });
    // console.log(CompleteData);
    // console.log(unCompleteData);

    const newData = [...CompleteData, ...unCompleteData];
    // console.log(newData);
    return newData;
  };

  getnewSeq = (data) => {
    //update current task && find new seq
    if (data.length > 0) {
      let lastIndex = data.length - 1;
      let lastData = parseInt(data[lastIndex]["seq"]) + 1;
      this.setState({ newSeq: lastData }); //set new seq
      this.setState({ totalTask: data.length });
    } else {
      this.setState({ newSeq: 0 });
      this.setState({ totalTask: 0 });
    }
  };

  changeNewTask = (e) => {
    console.log(e.target.value);
    this.setState({ newTasks: e.target.value });
  };

  reloadData = () => {
    console.log("reloading ..."); //reload data
    axios.get(baseurl).then((res) => {
      const tasks = this.sortedData(res.data.tasks); //sort data
      this.setState({ tasks });
      this.getnewSeq(tasks); //setnewseq
      console.log(tasks);
    });
  };

  completeData = (el) => {
    // console.log(el)

    let data = JSON.stringify({
      seq: el.seq,
      description: el.description,
      complete: true,
    });
    // console.log(data)

    this.updateDate(el.id, data);
    this.setState({ newTasks: "" });
  };

  deleteData = (id) => {
    // alert(id)
    // if (window.confirm("Do you want to delete the data?")) {
    axios
      .delete(baseurl + id)
      .then((response) => {
        console.log(response);
        this.reloadData();
      })
      .catch((error) => {
        console.log(error);
      });
    // }
  };

  clearData = () => {
    // var proceed = confirm("Are you sure you want to proceed?","yes");
    if (window.confirm("Do you want to clear all data?")) {
      this.state.tasks.forEach((data) => {
        console.log("remove id: " + data.id);
        this.deleteData(data.id);
      });
    }
  };

  addData = () => {
    let data = JSON.stringify({
      seq: this.state.newSeq,
      description: this.state.newTasks,
      complete: false,
    });

    axios
      .post(baseurl, data, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        console.log(response);
        this.reloadData();
        this.setState({ newTasks: "" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  changeSeqData = (updata, downdata) => {
    let newUpseq = 0;
    let newDownseq = 0;

    newUpseq = downdata.seq;
    newDownseq = updata.seq;
    // console.log(newUpseq);
    // console.log(newDownseq);
    let newUpdata = JSON.stringify({
      seq: newUpseq,
      description: updata.description,
      complete: updata.complete,
    });

    let newDowndata = JSON.stringify({
      seq: newDownseq,
      description: downdata.description,
      complete: downdata.complete,
    });

    // console.log(newUpdata)
    // console.log(newDowndata)
    this.updateDate(updata.id, newUpdata);
    this.updateDate(downdata.id, newDowndata);

  };

  updateDate=(id,data)=>{
    axios
      .put(baseurl + id, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response);
        this.reloadData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          width: "30%",
          height: "60%",
          backgroundColor:"yellow",
          marginTop: 120,
          background: "white",
          borderRadius: 35,
        }}
      >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          padding: 30,
          height: "85%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              textAlign: "left",
              fontSize: 30,
              color: "#61c972",
              fontWeight: "bold",
            }}
          >
            My Task Today
          </div>
          <img
            onClick={() => this.clearData()}
            src={eraser_icon}
            style={{ width: 25, height: 25 }}
            alt="Logo"
          />
        </div>

        <div
          style={{
            fontSize: 20,
            paddingBottom: 15,
          }}
        >
          {this.state.totalTask} Tasks
        </div>
        
        {this.state.tasks.map((data, index) => (
          <ul
            key={data.id}
            style={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              height: 40,
              alignItems: "center",
            }}
          >
            {/* <input
              type="checkbox"
              id="topping"
              name="topping"
              value={data.complete}
              defaultChecked={data.complete}
              onClick={() => this.completeData(data)}
              disabled={data.complete}
            /> */}

            {data.complete ? (
              <img
                src={checkbox0}
                style={{ width: 25, height: 25 }}
                alt="Logo"
              />
            ) : (
              <img
                src={checkbox1}
                onClick={() => this.completeData(data)}
                style={{ width: 25, height: 25 }}
                alt="Logo"
              />
            )}

            <div
              style={{
                marginLeft: 10,
                marginRight: 20,
                fontSize: 17,
                color: data.complete ? "gray" : "black",
                textDecorationLine: data.complete ? "line-through" : "none",
                wordBreak: "break-all",
              }}
            >
              {/* {data.seq} */}
              {data.description}
            </div>

            {data.complete ? null : (
              <img
                src={closeicon}
                onClick={() => {
                  if (window.confirm("Do you want to delete the data?")) {
                    this.deleteData(data.id);
                  }
                }}
                style={{ width: 15, height: 15, marginRight: 7 }}
                alt="Logo"
              />
            )}
            {index !== 0 ? ( //check data is not first
              !this.state.tasks[parseInt(index)].complete ? ( // check data is not complete
                !this.state.tasks[parseInt(index - 1)].complete ? ( // check previous data is not complete
                  <img
                    src={sort_up}
                    onClick={() => {
                      this.changeSeqData(
                        data,
                        this.state.tasks[parseInt(index - 1)]
                      );
                    }}
                    style={{ width: 18, height: 18, marginRight: 7 }}
                    alt="Logo"
                  />
                ) : null
              ) : null
            ) : null}
            {index !== parseInt(this.state.tasks.length) - 1 ? ( //check data is not last
              !this.state.tasks[parseInt(index)].complete ? ( //check data is not complete
                <img
                  src={sort_down}
                  onClick={() => {
                    this.changeSeqData(
                      this.state.tasks[parseInt(index + 1)],
                      data
                    );
                  }}
                  style={{ width: 18, height: 18 }}
                  alt="Logo"
                />
              ) : null
            ) : null}
          </ul>
        ))}
      </div>
      <div
          style={{
            backgroundColor: "#F8F8F8",
            textAlign: "center",
            padding: "10px",
            height:"15%",
            borderBottomLeftRadius:35,
            borderBottomRightRadius:35,
            bottom: 0,
            left: 0,
            right: 0,

          }}
        >
          <input
            type="text"
            value={this.state.newTasks}
            onChange={this.changeNewTask}
            placeholder="What we have we do?"
            maxLength="80"
            style={{
              width:"70%",
              fontSize:20,
              height:"100%",
              outline: "none",
              backgroundColor:"#F8F8F8"
            }}
          />
          <button 
          style={{
            width:"20%",
            height:"100%",
            color:"#61c972"
          }} onClick={this.addData }>Add</button>
        </div>
      </div>
    );
  }
}
