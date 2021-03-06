// calculate the sum of examples of the previous classes in the bin
var calculatePreviousSum = function(histogramData, numClasses){
  histogramData.forEach(function(histogram){
    histogram.data.forEach(function(bin){

      bin['fn'][0].previous_sum = 0
      bin['fp'][0].previous_sum = 0
      for (i = 1; i < numClasses; i++){
        bin['fn'][i].previous_sum = bin['fn'][i-1].previous_sum + bin['fn'][i-1].count
        bin['fp'][i].previous_sum = bin['fp'][i-1].previous_sum + bin['fp'][i-1].count
      }
      bin['tn'][0].previous_sum = bin['fn'][numClasses-1].previous_sum + bin['fn'][numClasses-1].count
      bin['tp'][0].previous_sum = bin['fp'][numClasses-1].previous_sum + bin['fp'][numClasses-1].count
    })
  })
  return histogramData
}

var calculatePreviousSumTPFN = function(histogramData, numClasses){
  histogramData.forEach(function(histogram){
    histogram.data.forEach(function(bin){

      bin['fn'][0].previous_sum = 0
      //bin['fp'][0].previous_sum = 0
      for (i = 1; i < numClasses; i++){
        bin['fn'][i].previous_sum = bin['fn'][i-1].previous_sum + bin['fn'][i-1].count
        //bin['fp'][i].previous_sum = bin['fp'][i-1].previous_sum + bin['fp'][i-1].count
      }
      //bin['tn'][0].previous_sum = bin['fn'][numClasses-1].previous_sum + bin['fn'][numClasses-1].count
      bin['tp'][0].previous_sum = 0 //bin['fp'][dataModel.numClasses-1].previous_sum + bin['fp'][dataModel.numClasses-1].count
    })
  })
  return histogramData
}

/* get the bin that the data belongs in */
var getBinNum = function(data, range, numBins){
  var bin = Math.floor((data - range.lowerBound)/
                        ((range.upperBound - range.lowerBound)/numBins))
  return (bin == 10) ? 9 : bin
}

/* return true if data is in the range, false otherwise */
var inRange = function(data, range){
  if (data >= +range.lowerBound && data <= +range.upperBound){
    return true;
  }
  return false;
}

/* classification is TP FP TN FN */
//ONLY WORKS FOR TP AND TN
var findMax = function(classification, histogramData){
  return d3.max(histogramData.map(function(histogram){ // max in each class
    return d3.max(histogram.data.map(function(bin){
      return bin[classification][0].count + bin[classification][0].previous_sum
    }))
  })
)}

var findMaxFN = function(histogramData){
  //console.log(histogramData)
  return d3.max(histogramData.map(function(histogram){ // max in each class
    return d3.max(histogram.data.map(function(bin){
      //return bin['fn'][0].count + bin[classification][0].previous_sum
      return d3.max(bin['fn'].map(function(d){
        return d.count + d.previous_sum
      }))
    }))
  }))
}

var calculateXDomain = function (pos, neg, histogramData) {
  var maxNeg = findMax(pos, histogramData);
  var maxPos = (neg == 'fn') ? findMaxFN(histogramData) : findMax(neg, histogramData)
  return Math.max(maxNeg , maxPos)
}

var calculateRangeFromBin = function(binNum, range){
  var lower = (range.upperBound - range.lowerBound)/10 * (binNum) + range.lowerBound
  var upper = (range.upperBound - range.lowerBound)/10 * (binNum + 1) + range.lowerBound
  return {lowerBound:lower, upperBound:upper}
}

var getSelectedStackInfo = function(element, isDistribution, range){
  var thisClass = element.attr('class').split(' ')
  var classification = thisClass[0] //fp, tp, tn, fn
  var binNum = 9 - element.parent().attr('class').split(' ')[1] //bin number
  var stackRange = calculateRangeFromBin(binNum, range)
  //console.log(stackRange)
  var actualClass = "";
  var predictedClass = "";
  var distance = false;

  if (element.parent().parent().parent().attr('class').split(' ')[0] == "distance-histogram"){
    distance = true;
  }
  if (classification == 'TP'){
    actualClass = element.parent().parent().parent().attr('class').split(' ')[1] //svg's class //use whatever the svg class is for probability
    predictedClass = actualClass
  }
  else if (classification == 'FP'){
    actualClass = thisClass[1]  //text
    predictedClass = element.parent().parent().parent().attr('class').split(' ')[1] //svg class
  }
  else{
    if (isDistribution){
      actualClass = element.parent().parent().parent().attr('class').split(' ')[1] //svg class
      predictedClass = thisClass[1]
    }
    else {
      actualClass = element.parent().parent().parent().attr('class').split(' ')[1]
      predictedClass = thisClass[1]
    }
  }

  var info = {
    classification: classification,
    binNum: binNum,
    actualClass: +actualClass.charAt(actualClass.length - 1), //class0 => 0
    predictedClass: +predictedClass.charAt(predictedClass.length - 1),
    distance: distance,
    range: stackRange
  };
  return info
}

var removeAll = function(selectedInfo, maxSelect){
  var all = $(".FP, .TP, .FN, .TN")
  all.removeClass("highlight")
  for (var i = 0; i < maxSelect; i++){
    selectedInfo.pop()
  }
}

var addSelectedStack = function(element, selectedInfo, numSelected, isDistribution, range){
  // highlight new array, add info, change numSelected
  element.addClass("highlight")
    //var stackRange = calculateRangeFromBin(binNum, range)
  selectedInfo.push(getSelectedStackInfo(element, isDistribution, range))
  numSelected[0] += 1;

  /*if (numSelected[0] == 1){
    element.addClass("highlight")
    selectedInfo.push(getSelectedStackInfo(element, isDistribution))
    ///console.log(selectedInfo)
  }
  else if(numSelected[0] == 2){
    element.addClass("highlight")
    selectedInfo.push(getSelectedStackInfo(element, isDistribution))
    //console.log(selectedInfo)
    // function to make comparisons
  }
  else{ //new selections
    // remove highlights and empty info array
    var all = $(".FP, .TP, .FN, .TN")
    all.removeClass("highlight")
    selectedInfo.pop()
    selectedInfo.pop()
    // highlight new array, add info, change numSelected
    element.addClass("highlight")
    selectedInfo.push(getSelectedStackInfo(element))
    numSelected[0] = 1;
    //console.log(selectedInfo)*/
  //}
}

var removeSelectedStack = function(element, selectedInfo, numSelected, isDistribution, range){
  numSelected[0] -= 1
  var infoToRemove = getSelectedStackInfo(element, isDistribution, range)
  for (i=0; i < selectedInfo.length; i++){
    if (selectedInfo[i].actualClass == infoToRemove.actualClass
      && selectedInfo[i].binNum == infoToRemove.binNum
      && selectedInfo[i].classification == infoToRemove.classification
      && selectedInfo[i].predictedClass == infoToRemove.predictedClass)
      selectedInfo.splice(i, 1)
  }
  element.removeClass("highlight")
}
