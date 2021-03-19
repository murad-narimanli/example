import React from "react";

export const convertColumns = (data, columns) => {
  if (window.innerWidth > 990) {
    return data;
  } else {
    let response = [];
    data.forEach((d, index) => {
      let newob = {};
      columns.forEach((c) => {
        if (c.con) {
          newob[c.key] = (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span className='text-left'>{c.value}</span>
              <span className='text-right'>{d[c.key]}</span>
            </div>
          );
        } else {
          newob[c.key] = d[c.key];
        }
      });
      newob.key = index;
      response.push(newob);
    });
    return response;
  }
};


export const createColumns = (columns, initial) => {
  let obj = [];
  columns.forEach((c,index)=>{
    obj.push({title: c.value, dataIndex: c.key, key: (index + 1).toString()})
  })
  return initial;
};