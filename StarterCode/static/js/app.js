//Read in samples.json
  
let url = "samples.json";

//Retrieve JSON data and console log it

d3.json(url).then(function(data) {
   console.log(data);
});

//Create Drop Down to select "Subject ID" from names

function init (){
   let dropdown = d3.select("#selDataset");
   
   d3.json(url).then(function(data) {

      let names = data.names;

      for (subjectID of names){
         dropdown.append("option").text(subjectID).property("value",subjectID);
      }

      let first_id = names[0];
      optionChanged(first_id);

   })   

}
init();

//Update Demographics Table with metadata info upon d3.select from names Subject ID dropdown

function updateDemographicsTable(subject_id){
   d3.json("samples.json").then(function(data){
      let metadata = data.metadata;
      let demographic_info = metadata.filter((subject_info)=>subject_info.id == subject_id);

      if (demographic_info.length>0){
         let first_id = demographic_info[0];
         let demographics = d3.select("#sample-metadata");
         //reset selection
         demographics.html("");
         Object.entries(first_id).forEach(([key,value])=>{
            demographics.append("h6").text(`${key}: ${value}`);
         });

      }else {
         console.log("No sample data");
      }
   });
}

//Update Bar and Bubble Charts with samples info upon d3.select from id dropdown

function updatePlotly(subject_id){
   d3.json("samples.json").then(function(data){
      let samples = data.samples;
      let chart_data = samples.filter((subject_info)=>subject_info.id == subject_id);

      if (chart_data.length >0){
         let next = chart_data[0];
         let otu_ids=next.otu_ids;
         let otu_labels = next.otu_labels;
         let sample_values = next.sample_values;

         let trace = {
            x:otu_ids,
            y: sample_values,
            text: otu_labels,
            type:"bubble",
            mode:"markers",
            marker: {
               size: sample_values,
               color:otu_ids,
               colorscale:"Jet"
            }
         }

         Plotly.newPlot("bubble",[trace])

         let y_axis = otu_ids.slice(0,10).map(id => `otu ${id}`).reverse()
         let trace2 = {
            x:sample_values.slice(0,10).reverse(),
            y: y_axis,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {
               size: sample_values,
               color:otu_ids,
               colorscale:"Jet"
            }
         }
         Plotly.newPlot("bar",[trace2])

      }else {
         console.log("No sample data");
      }
   });
}
//Update Weekly Washing Frequency Gauge with metadata wfreq upon d3.select from id dropdown

function updatePlotlygauge(subject_id){
   d3.json("samples.json").then(function(data){
      let metadata = data.metadata;
      let gauge_data = metadata.filter((subject_info)=>subject_info.id == subject_id);

      if (gauge_data.length >0){
         let next = gauge_data[0];
         let wfreq =next.wfreq;
         let trace3 = {
           domain: { x: [0, 1], y: [0, 1] },
           type: "indicator",
           mode: "gauge",
           value: wfreq,
           title: { text: "Washing Frequency/Scrubs per week", font: { size: 14 } },
           gauge: {
               axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
               bar: { color: "darkblue" },
               bgcolor: "white",
               borderwidth: 2,
               bordercolor: "gray",
           }
       };
         
           Plotly.newPlot('MyDiv', [trace3]);
       
       }else {
           console.log("No sample data");
       }
   });
}

//Initate changes by Subject ID

function optionChanged(subject_id){
   updateDemographicsTable(subject_id);
   updatePlotlygauge(subject_id);
   updatePlotly(subject_id);
   
}
