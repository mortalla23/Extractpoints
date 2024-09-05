function basic(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.DateCode != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.DateCode };
    }
    //
    if (message.Data.SensorPosition != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.SensorPosition };
    }
    return points;
}

function simpleMetering(message, time)
{
    const points = {};

    if(message.Data == null){
      return points;
    }
    //
    if (message.Data.ReactivePower != null) {
      let point =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":ReactivePower:" +
        message.EndPoint;
      points[point] = { unitId: "var", record: message.Data.ReactivePower };
    }
    if (message.Data.ActivePower != null) {
      let point =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":ActivePower:" +
        message.EndPoint;
      points[point] = { unitId: "W", record: message.Data.ActivePower };
    }
    if (message.Data.ReactiveEnergy != null) {
      let point =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":ReactiveEnergy:" +
        message.EndPoint;
      points[point] = { unitId: "varh", record: message.Data.ReactiveEnergy };
    }
    if (message.Data.ActiveEnergy != null) {
      let point =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":ActiveEnergy:" +
        message.EndPoint;
      points[point] = { unitId: "Wh", record: message.Data.ActiveEnergy };
    }
    if (message.Data.NumberOfSamples != null) {
      let point =
          message.ClusterID +
          ":" +
          message.AttributeID +
          ":NumberOfSamples:" +
          message.EndPoint;
      points[point] = { record: message.Data.NumberOfSamples };
    }

    return points;    
}

function configuration(message, time)
{
    const points = {};
    return points;
}

function lorawan(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.PeriodWithoutReceiving != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":PeriodWithoutReceiving:" + message.EndPoint;
      points[point] = { unitId: "minute", record: message.Data.PeriodWithoutReceiving };
    }
    if (message.Data.NumberOfConsecutiveFailures != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":NumberOfConsecutiveFailures:" + message.EndPoint;
      points[point] = { record: message.Data.NumberOfConsecutiveFailures };
    }
    return points;
}

function temperature(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.MeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "Cel", record: message.Data.MeasuredValue / 100 };
    }
    if (message.Data.MinMeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "Cel", record: message.Data.MinMeasuredValue / 100 };
    }
    if (message.Data.MaxMeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "Cel", record: message.Data.MaxMeasuredValue / 100 };
    }
    return points;
}

function binaryInput(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.BinaryValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.BinaryValue };
    }
    if (message.Data.CounterValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.CounterValue };
    }
    if (message.Data.DebouncePeriod != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.DebouncePeriod };
    }

    return points;
}

function relativeHumidity(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.MeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "%RH", record: message.Data.MeasuredValue / 100 };
    }
    if (message.Data.MinMeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "%RH", record: message.Data.MinMeasuredValue / 100 };
    }
    if (message.Data.MaxMeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "%RH", record: message.Data.MaxMeasuredValue / 100 };
    }
    return points;
}

function analogInput(message, time, model)
{
    const points = {};

    if(message.Data == null){
        return points;
    }

    if(model != null){
        switch(model.moduleId){
            case "th":
                if (message.Data.SinglePrecisionValue != null) {
                    points.illuminance = { unitId: "lx", record: message.Data.SinglePrecisionValue};
                }
                break;

        }
    }

    //
    if (message.Data.PowerDuration != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.PowerDuration };
    }

    return points;
}

function multiBinaryInput(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.BinaryValues != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.BinaryValues };
    }
    return points;
}

function volumeMeter(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.VolumeIndex != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.VolumeIndex };
    }
    if (message.Data.MinFlowIndex != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.MinFlowIndex };
    }
    if (message.Data.MaxFlowIndex != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.MaxFlowIndex };
    }
    return points;
}

function senso(message, time)
{
    const points = {};

    if(message.Data == null){
      return points;
    }
    if(message.Data.CountDowns != null){
      if (message.Data.CountDowns.CountDown1 != null) {
        let point =
            message.ClusterID + ":" + message.AttributeID + ":CountDown1:" + message.EndPoint;
        points[point] = { record: message.Data.CountDowns.CountDown1 };
      }
      if (message.Data.CountDowns.CountDown2 != null) {
        let point =
            message.ClusterID + ":" + message.AttributeID + ":CountDown2:" + message.EndPoint;
        points[point] = { record: message.Data.CountDowns.CountDown2 };
      }
      if (message.Data.CountDowns.CountDown3 != null) {
        let point =
            message.ClusterID + ":" + message.AttributeID + ":CountDown3:" + message.EndPoint;
        points[point] = { record: message.Data.CountDowns.CountDown3 };
      }
    }
    //
    if (message.Data.InstallationRotation != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.InstallationRotation };
    }
    //
    if (message.Data.VolumeRotation != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.VolumeRotation / 10 };
    }
    //
    if (message.Data.Temperature != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "Cel", record: message.Data.Temperature };
    }
    //
    if (message.Data.Parameters != null) {
      if (message.Data.Parameters.VolumeThreshold != null) {
        let point =
            message.ClusterID + ":" + message.AttributeID + ":VolumeThreshold:" + message.EndPoint;
        points[point] = { record: message.Data.Parameters.VolumeThreshold };
      }
      if (message.Data.Parameters.PeriodCalculateAverageLeakFlow != null) {
        let point =
            message.ClusterID + ":" + message.AttributeID + ":PeriodCalculateAverageLeakFlow:" + message.EndPoint;
        points[point] = { record: message.Data.Parameters.PeriodCalculateAverageLeakFlow };
      }
      if (message.Data.Parameters.PeriodObservationAverageLeakFlow != null) {
        let point =
            message.ClusterID + ":" + message.AttributeID + ":PeriodObservationAverageLeakFlow:" + message.EndPoint;
        points[point] = { record: message.Data.Parameters.PeriodObservationAverageLeakFlow };
      }
    }

    return points;    
}

function onOff(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.RelayState != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.RelayState };
    }

    return points;
}

function powerQuality(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.Fields != null) {
      let freqPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":Freq:" +
        message.EndPoint;
      points[freqPoint] = { unitId: "hertz", record: message.Data.Fields.Freq * 1000 };
    //
      let freqMinPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":FreqMin:" +
        message.EndPoint;
      points[freqMinPoint] = { unitId: "hertz", record: message.Data.Fields.FreqMin * 1000 };
    //
      let freqMaxPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":FreqMax:" +
        message.EndPoint;
      points[freqMaxPoint] = { unitId: "hertz", record: message.Data.Fields.FreqMax * 1000 };
    //
      let vrmsPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":Vrms:" +
        message.EndPoint;
      points[vrmsPoint] = { unitId: "V", record: message.Data.Fields.Vrms * 10 };
    //
      let vrmsMinPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":VrmsMin:" +
        message.EndPoint;
      points[vrmsMinPoint] = { uniId: "V", record: message.Data.Fields.VrmsMin * 10 };
    //
      let vrmsMaxPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":VrmsMax:" +
        message.EndPoint;
      points[vrmsMaxPoint] = { unitId: "V", record: message.Data.Fields.VrmsMax * 10 };
    //
      let vpeakPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":Vpeak:" +
        message.EndPoint;
      points[vpeakPoint] = { unitId: "V", record: message.Data.Fields.Vpeak * 10 };
    //
      let vpeakMinPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":VpeakMin:" +
        message.EndPoint;
      points[vpeakMinPoint] = {unitId: "V", record: message.Data.Fields.VpeakMin * 10 };
    //
      let vpeakMaxPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":VpeakMax:" +
        message.EndPoint;
      points[vpeakMaxPoint] = { unitId: "V", record: message.Data.Fields.VpeakMax * 10 };
    //
      let overVoltageNumberPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":OverVoltageNumber:" +
        message.EndPoint;
      points[overVoltageNumberPoint] = { record: message.Data.Fields.OverVoltageNumber };
    //
      let sagNumberPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":SagNumber:" +
        message.EndPoint;
      points[sagNumberPoint] = { record: message.Data.Fields.SagNumber };
    //
      let brownoutNumberPoint =
        message.ClusterID +
        ":" +
        message.AttributeID +
        ":BrownoutNumber:" +
        message.EndPoint;
      points[brownoutNumberPoint] = { record: message.Data.Fields.BrownoutNumber };
    }
    //
    if (message.Data.SagHalfCycleThreshold != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.SagHalfCycleThreshold * 10 };
    }
    if (message.Data.SagVoltageThreshold != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.SagVoltageThreshold * 10 };
    }
    if (message.Data.PeakOverVoltageThreshold != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "V", record: message.Data.PeakOverVoltageThreshold * 10 };
    }
    return points;
}

function pressure(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.MeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MeasuredValue };
    }
    if (message.Data.MinMeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MinMeasuredValue };
    }
    if (message.Data.MaxMeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MaxMeasuredValue };
    }
    return points;
}

function differentialPressure(message, time)
{
    const points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.MeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MeasuredValue };
    }
    if (message.Data.MinMeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MinMeasuredValue };
    }
    if (message.Data.MaxMeasuredValue != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MaxMeasuredValue };
    }
    if (message.Data.Period != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.Period };
    }
    if (message.Data.NumberOfSamples != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.NumberOfSamples };
    }
    if (message.Data.NumberOfConfirmationSamples != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.NumberOfConfirmationSamples };
    }
    if (message.Data.SamplingPeriod != null) {
      let point =
          message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { record: message.Data.SamplingPeriod };
    }
    if (message.Data.MeanMeasuredValueSinceLastReport != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MeanMeasuredValueSinceLastReport };
    }
    if (message.Data.MinimalMeasuredValueSinceLastReport != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MinimalMeasuredValueSinceLastReport };
    }
    if (message.Data.MaximalMeasuredValueSinceLastReport != null) {
      let point =
        message.ClusterID + ":" + message.AttributeID + ":" + message.EndPoint;
      points[point] = { unitId: "hPa", record: message.Data.MaximalMeasuredValueSinceLastReport };
    }
    return points;
}

function tic_ice(message, time)
{
    let points = {};
    if(message.Data == null){
      return points;
    }
    if (message.Data.ReadingPeriod != null) {
      let point =
          message.ClusterID +
          ":" +
          message.AttributeID +
          ":" +
          message.EndPoint;
      points[point] = { record: message.Data.ReadingPeriod };
    }
    if (message.Data.Fields != null) {
        if(message.Data.Fields.DATECOUR != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATECOUR:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATECOUR };
        }
        if(message.Data.Fields.DATE != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATE:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATE };
        }
        if(message.Data.Fields.DATEPA1 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATEPA1:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATEPA1 };
        }
        if(message.Data.Fields.DATEPA2 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATEPA2:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATEPA2 };
        }
        if(message.Data.Fields.DATEPA3 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATEPA3:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATEPA3 };
        }
        if(message.Data.Fields.DATEPA4 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATEPA4:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATEPA4 };
        }
        if(message.Data.Fields.DATEPA5 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATEPA5:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATEPA5 };
        }
        if(message.Data.Fields.DATEPA6 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATEPA6:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATEPA6 };
        }
        if(message.Data.Fields.DEBUTp != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DEBUTp:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DEBUTp };
        }
        if(message.Data.Fields.FINp != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":FINp:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.FINp };
        }
        if(message.Data.Fields.DATE_EAp != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATE_EAp:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATE_EAp };
        }
        if(message.Data.Fields.DATE_ERPp != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATE_ERPp:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATE_ERPp };
        }
        if(message.Data.Fields.DATE_ERNp != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATE_ERNp:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATE_ERNp };
        }
        if(message.Data.Fields.DEBUTp1 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DEBUTp1:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DEBUTp1 };
        }
        if(message.Data.Fields.FINp1 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":FINp1:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.FINp1 };
        }
        if(message.Data.Fields.DATE_EAp1 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATE_EAp1:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATE_EAp1 };
        }
        if(message.Data.Fields.DATE_ERPp1 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATE_ERPp1:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATE_ERPp1 };
        }
        if(message.Data.Fields.DATE_ERNp1 != null){
          let point =
              message.ClusterID +
              ":" +
              message.AttributeID +
              ":DATE_ERNp1:" +
              message.EndPoint;
          points[point] = { record: message.Data.Fields.DATE_ERNp1 };
        }
      if (message.Data.Fields.EA != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EA:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EA };
      }
      if (message.Data.Fields.ERP != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERP:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERP };
      }
      if (message.Data.Fields.PA1 != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PA1:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PA1 };
      }
      if (message.Data.Fields.PA2 != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PA2:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PA2 };
      }
      if (message.Data.Fields.PA3 != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PA3:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PA3 };
      }
      if (message.Data.Fields.PA4 != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PA4:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PA4 };
      }
      if (message.Data.Fields.PA5 != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PA5:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PA5 };
      }
      if (message.Data.Fields.PA6 != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PA6:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PA6 };
      }
      if (message.Data.Fields.KDC != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":KDC:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.KDC };
      }
      if (message.Data.Fields.KDCD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":KDCD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.KDCD };
      }
      if (message.Data.Fields.PSP != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSP:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSP };
      }
      if (message.Data.Fields.PSPM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSPM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSPM };
      }
      if (message.Data.Fields.PSHPH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHPH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHPH };
      }
      if (message.Data.Fields.PSHPD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHPD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHPD };
      }
      if (message.Data.Fields.PSHCH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHCH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHCH };
      }
      if (message.Data.Fields.PSHCD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHCD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHCD };
      }
      if (message.Data.Fields.PSHPE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHPE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHPE };
      }
      if (message.Data.Fields.PSHCE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHCE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHCE };
      }
      if (message.Data.Fields.PSJA != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSJA:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSJA };
      }
      if (message.Data.Fields.PSHH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHH };
      }
      if (message.Data.Fields.PSHD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHD };
      }
      if (message.Data.Fields.PSHM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSHM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSHM };
      }
      if (message.Data.Fields.PSDSM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSDSM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSDSM };
      }
      if (message.Data.Fields.PSCCM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PSCCM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PSCCM };
      }
      if (message.Data.Fields.PA1MN != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PA1MN:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PA1MN };
      }
      if (message.Data.Fields.PA10MN != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PA10MN:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PA10MN };
      }
      if (message.Data.Fields.PREA1MN != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PREA1MN:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PREA1MN * 1000 };
      }
      if (message.Data.Fields.PREA10MN != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":PREA10MN:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.PREA10MN * 1000 };
      }
      if (message.Data.Fields.U10MN != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":U10MN:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.U10MN };
      }
      if (message.Data.Fields.EApP != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApP:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApP };
      }
      if (message.Data.Fields.EApPM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApPM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApPM };
      }
      if (message.Data.Fields.EApHCE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHCE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHCE };
      }
      if (message.Data.Fields.EApHCH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHCH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHCH };
      }
      if (message.Data.Fields.EApHH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHH };
      }
      if (message.Data.Fields.EApHCD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHCD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHCD };
      }
      if (message.Data.Fields.EApHD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHD };
      }
      if (message.Data.Fields.EApJA != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApJA:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApJA };
      }
      if (message.Data.Fields.EApHPE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHPE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHPE };
      }
      if (message.Data.Fields.EApHPH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHPH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHPH };
      }
      if (message.Data.Fields.EApHPD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHPD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHPD };
      }
      if (message.Data.Fields.EApSCM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApSCM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApSCM };
      }
      if (message.Data.Fields.EApHM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApHM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApHM };
      }
      if (message.Data.Fields.EApDSM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EApDSM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EApDSM };
      }
      if (message.Data.Fields.ERPpP != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpP:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpP * 1000 };
      }
      if (message.Data.Fields.ERPpPM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpPM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpPM * 1000 };
      }
      if (message.Data.Fields.ERPpHCE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHCE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHCE * 1000 };
      }
      if (message.Data.Fields.ERPpHCH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHCH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHCH * 1000 };
      }
      if (message.Data.Fields.ERPpHH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHH * 1000 };
      }
      if (message.Data.Fields.ERPpHCD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHCD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHCD * 1000 };
      }
      if (message.Data.Fields.ERPpHD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHD * 1000 };
      }
      if (message.Data.Fields.ERPpJA != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpJA:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpJA * 1000 };
      }
      if (message.Data.Fields.ERPpHPE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHPE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHPE * 1000 };
      }
      if (message.Data.Fields.ERPpHPH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHPH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHPH * 1000 };
      }
      if (message.Data.Fields.ERPpHPD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHPD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHPD * 1000 };
      }
      if (message.Data.Fields.ERPpSCM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpSCM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpSCM * 1000 };
      }
      if (message.Data.Fields.ERPpHM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpHM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpHM * 1000 };
      }
      if (message.Data.Fields.ERPpDSM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPpDSM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPpDSM * 1000 };
      }
      if (message.Data.Fields.ERNpP != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpP:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpP * 1000 };
      }
      if (message.Data.Fields.ERNpPM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpPM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpPM * 1000 };
      }
      if (message.Data.Fields.ERNpHCE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHCE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHCE * 1000 };
      }
      if (message.Data.Fields.ERNpHCH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHCH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHCH * 1000 };
      }
      if (message.Data.Fields.ERNpHH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHH * 1000 };
      }
      if (message.Data.Fields.ERNpHCD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHCD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHCD * 1000 };
      }
      if (message.Data.Fields.ERNpHD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHD * 1000 };
      }
      if (message.Data.Fields.ERNpJA != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpJA:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpJA * 1000 };
      }
      if (message.Data.Fields.ERNpHPE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHPE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHPE * 1000 };
      }
      if (message.Data.Fields.ERNpHPH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHPH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHPH * 1000 };
      }
      if (message.Data.Fields.ERNpHPD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHPD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHPD * 1000 };
      }
      if (message.Data.Fields.ERNpSCM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpSCM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpSCM * 1000 };
      }
      if (message.Data.Fields.ERNpHM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpHM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpHM * 1000 };
      }
      if (message.Data.Fields.ERNpDSM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNpDSM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNpDSM * 1000 };
      }
      if (message.Data.Fields.EAp1P != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1P:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1P * 1000 };
      }
      if (message.Data.Fields.EAp1PM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1PM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1PM * 1000 };
      }
      if (message.Data.Fields.EAp1HCE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HCE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HCE * 1000 };
      }
      if (message.Data.Fields.EAp1HCH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HCH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HCH * 1000 };
      }
      if (message.Data.Fields.EAp1HH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HH * 1000 };
      }
      if (message.Data.Fields.EAp1HCD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HCD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HCD * 1000 };
      }
      if (message.Data.Fields.EAp1HD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HD * 1000 };
      }
      if (message.Data.Fields.EAp1JA != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1JA:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1JA * 1000 };
      }
      if (message.Data.Fields.EAp1HPE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HPE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HPE * 1000 };
      }
      if (message.Data.Fields.EAp1HPH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HPH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HPH * 1000 };
      }
      if (message.Data.Fields.EAp1HPD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HPD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HPD * 1000 };
      }
      if (message.Data.Fields.EAp1SCM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1SCM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1SCM * 1000 };
      }
      if (message.Data.Fields.EAp1HM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1HM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1HM * 1000 };
      }
      if (message.Data.Fields.EAp1DSM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":EAp1DSM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.EAp1DSM * 1000 };
      }
      if (message.Data.Fields.ERPp1P != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1P:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1P };
      }
      if (message.Data.Fields.ERPp1PM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1PM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1PM };
      }
      if (message.Data.Fields.ERPp1HCE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HCE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HCE };
      }
      if (message.Data.Fields.ERPp1HCH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HCH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HCH };
      }
      if (message.Data.Fields.ERPp1HH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HH };
      }
      if (message.Data.Fields.ERPp1HCD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HCD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HCD };
      }
      if (message.Data.Fields.ERPp1HD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HD };
      }
      if (message.Data.Fields.ERPp1JA != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1JA:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1JA };
      }
      if (message.Data.Fields.ERPp1HPE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HPE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HPE };
      }
      if (message.Data.Fields.ERPp1HPH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HPH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HPH };
      }
      if (message.Data.Fields.ERPp1HPD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HPD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HPD };
      }
      if (message.Data.Fields.ERPp1SCM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1SCM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1SCM };
      }
      if (message.Data.Fields.ERPp1HM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1HM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1HM };
      }
      if (message.Data.Fields.ERPp1DSM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERPp1DSM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERPp1DSM };
      }
      if (message.Data.Fields.ERNp1P != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1P:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1P };
      }
      if (message.Data.Fields.ERNp1PM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1PM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1PM };
      }
      if (message.Data.Fields.ERNp1HCE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HCE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HCE };
      }
      if (message.Data.Fields.ERNp1HCH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HCH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HCH };
      }
      if (message.Data.Fields.ERNp1HH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HH };
      }
      if (message.Data.Fields.ERNp1HCD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HCD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HCD };
      }
      if (message.Data.Fields.ERNp1HD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HD };
      }
      if (message.Data.Fields.ERNp1JA != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1JA:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1JA };
      }
      if (message.Data.Fields.ERNp1HPE != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HPE:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HPE };
      }
      if (message.Data.Fields.ERNp1HPH != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HPH:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HPH };
      }
      if (message.Data.Fields.ERNp1HPD != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HPD:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HPD };
      }
      if (message.Data.Fields.ERNp1SCM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1SCM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1SCM };
      }
      if (message.Data.Fields.ERNp1HM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1HM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1HM };
      }
      if (message.Data.Fields.ERNp1DSM != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":ERNp1DSM:" +
            message.EndPoint;
        points[point] = { record: message.Data.Fields.ERNp1DSM };
      }
    }
    return points;
}

function tic_cbe(message, time)
{
    const points = {};
    if(message.Data == null){
        return points;
    }
    if (message.Data.ReadingPeriod != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":" +
            message.EndPoint;
        points[point] = { record: message.Data.ReadingPeriod };
    }
    if (message.Data.Fields != null) {
        if (message.Data.Fields.ADIR1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ADIR1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ADIR1 };
        }
        if (message.Data.Fields.ADIR2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ADIR2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ADIR2 };
        }
        if (message.Data.Fields.ADIR3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ADIR3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ADIR3 };
        }
        if (message.Data.Fields.ISOUSC != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ISOUSC:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ISOUSC };
        }
        if (message.Data.Fields.BASE != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":BASE:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.BASE };
        }
        if (message.Data.Fields.HCHC != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":HCHC:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.HCHC };
        }
        if (message.Data.Fields.HCHP != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":HCHP:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.HCHP };
        }
        if (message.Data.Fields.EJPHN != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EJPHN:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EJPHN };
        }
        if (message.Data.Fields.EJPHPM != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EJPHPM:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EJPHPM };
        }
        if (message.Data.Fields.BBRHCJB != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":BBRHCJB:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.BBRHCJB };
        }
        if (message.Data.Fields.BBRHPJB != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":BBRHPJB:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.BBRHPJB };
        }
        if (message.Data.Fields.BBRHCJW != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":BBRHCJW:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.BBRHCJW };
        }
        if (message.Data.Fields.BBRHPJW != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":BBRHPJW:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.BBRHPJW };
        }
        if (message.Data.Fields.BBRHCJR != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":BBRHCJR:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.BBRHCJR };
        }
        if (message.Data.Fields.BBRHPJR != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":BBRHPJR:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.BBRHPJR };
        }
        if (message.Data.Fields.PEJP != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PEJP:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PEJP };
        }
        if (message.Data.Fields.GAZ != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":GAZ:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.GAZ };
        }
        if (message.Data.Fields.AUTRE != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":AUTRE:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.AUTRE };
        }
        if (message.Data.Fields.IINST != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IINST:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IINST };
        }
        if (message.Data.Fields.IINST1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IINST1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IINST1 };
        }
        if (message.Data.Fields.IINST2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IINST2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IINST2 };
        }
        if (message.Data.Fields.IINST3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IINST3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IINST3 };
        }
        if (message.Data.Fields.ADPS != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ADPS:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ADPS };
        }
        if (message.Data.Fields.IMAX != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IMAX:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IMAX };
        }
        if (message.Data.Fields.IMAX1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IMAX1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IMAX1 };
        }
        if (message.Data.Fields.IMAX2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IMAX2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IMAX2 };
        }
        if (message.Data.Fields.IMAX3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IMAX3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IMAX3 };
        }
        if (message.Data.Fields.PMAX != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAX:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAX };
        }
        if (message.Data.Fields.PAPP != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PAPP:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PAPP };
        }
    }

    return points;
}

function tic_cje(message, time)
{
    let points = {};
    if(message.Data == null){
        return points;
    }
    if (message.Data.ReadingPeriod != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":" +
            message.EndPoint;
        points[point] = { record: message.Data.ReadingPeriod };
    }
    if (message.Data.Fields != null) {
        if (message.Data.Fields.JAUNE6 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":JAUNE6:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.JAUNE6 / 10.0 };
        }
        if (message.Data.Fields.JAUNE7 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":JAUNE7:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.JAUNE7 };
        }
        if (message.Data.Fields.ENERG0 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ENERG0:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ENERG0 };
        }
        if (message.Data.Fields.ENERG1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ENERG1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ENERG1 };
        }
        if (message.Data.Fields.ENERG2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ENERG2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ENERG2 };
        }
        if (message.Data.Fields.ENERG3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ENERG3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ENERG3 };
        }
        if (message.Data.Fields.ENERG4 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ENERG4:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ENERG4 };
        }
        if (message.Data.Fields.ENERG5 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ENERG5:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ENERG5 };
        }
        if (message.Data.Fields.PMAXC0 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAXC0:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAXC0 / 10.0 };
        }
        if (message.Data.Fields.PMAXC1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAXC1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAXC1 / 10.0 };
        }
        if (message.Data.Fields.PMAXC2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAXC2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAXC2 / 10.0 };
        }
        if (message.Data.Fields.PMAXC3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAXC3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAXC3 / 10.0 };
        }
        if (message.Data.Fields.TDEPA0 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":TDEPA0:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.TDEPA0 };
        }
        if (message.Data.Fields.TDEPA1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":TDEPA1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.TDEPA1 };
        }
        if (message.Data.Fields.TDEPA2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":TDEPA2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.TDEPA2 };
        }
        if (message.Data.Fields.TDEPA3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":TDEPA3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.TDEPA3 };
        }
        if (message.Data.Fields.PMAXP0 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAXP0:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAXP0 / 10.0 };
        }
        if (message.Data.Fields.PMAXP1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAXP1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAXP1 / 10.0 };
        }
        if (message.Data.Fields.PMAXP2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAXP2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAXP2 / 10.0 };
        }
        if (message.Data.Fields.PMAXP3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAXP3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAXP3 / 10.0 };
        }
        if (message.Data.Fields.PSOUSC0 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PSOUSC0:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PSOUSC0 / 10.0 };
        }
        if (message.Data.Fields.PSOUSC1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PSOUSC1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PSOUSC1 / 10.0 };
        }
        if (message.Data.Fields.PSOUSC2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PSOUSC2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PSOUSC2 / 10.0 };
        }
        if (message.Data.Fields.PSOUSC3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PSOUSC3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PSOUSC3 / 10.0 };
        }
        if (message.Data.Fields.PSOUSP0 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PSOUSP0:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PSOUSP0 / 10.0 };
        }
        if (message.Data.Fields.PSOUSP1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PSOUSP1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PSOUSP1 / 10.0 };
        }
        if (message.Data.Fields.PSOUSP2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PSOUSP2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PSOUSP2 / 10.0 };
        }
        if (message.Data.Fields.PSOUSP3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PSOUSP3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PSOUSP3 / 10.0 };
        }
        if (message.Data.Fields.FCOU2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":FCOU2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.FCOU2 };
        }
    }
    return points;
}

function tic_std(message, time)
{
    let points = {};
    if(message.Data == null){
        return points;
    }
    if (message.Data.ReadingPeriod != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":" +
            message.EndPoint;
        points[point] = { record: message.Data.ReadingPeriod };
    }
    if (message.Data.Fields != null) {
        if (message.Data.Fields.DATE != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DATE:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DATE };
        }
        if (message.Data.Fields.EAST != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EAST:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EAST };
        }
        if (message.Data.Fields.EASF01 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF01:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF01 };
        }
        if (message.Data.Fields.EASF02 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF02:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF02 };
        }
        if (message.Data.Fields.EASF03 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF03:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF03 };
        }
        if (message.Data.Fields.EASF04 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF04:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF04 };
        }
        if (message.Data.Fields.EASF05 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF05:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF05 };
        }
        if (message.Data.Fields.EASF06 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF06:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF06 };
        }
        if (message.Data.Fields.EASF07 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF07:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF07 };
        }
        if (message.Data.Fields.EASF08 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF08:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF08 };
        }
        if (message.Data.Fields.EASF09 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF09:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF09 };
        }
        if (message.Data.Fields.EASF10 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASF10:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASF10 };
        }
        if (message.Data.Fields.EASD01 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASD01:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASD01 };
        }
        if (message.Data.Fields.EASD02 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASD02:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASD02 };
        }
        if (message.Data.Fields.EASD03 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASD03:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASD03 };
        }
        if (message.Data.Fields.EASD04 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EASD04:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EASD04 };
        }
        if (message.Data.Fields.EAIT != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EAIT:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EAIT };
        }
        if (message.Data.Fields.ERQ1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ERQ1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ERQ1 };
        }
        if (message.Data.Fields.ERQ2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ERQ2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ERQ2 };
        }
        if (message.Data.Fields.ERQ3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ERQ3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ERQ3 };
        }
        if (message.Data.Fields.ERQ4 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ERQ4:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.ERQ4 };
        }
        if (message.Data.Fields.IRMS1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IRMS1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IRMS1 };
        }
        if (message.Data.Fields.IRMS2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IRMS2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IRMS2 };
        }
        if (message.Data.Fields.IRMS3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":IRMS3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.IRMS3 };
        }
        if (message.Data.Fields.URMS1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":URMS1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.URMS1 };
        }
        if (message.Data.Fields.URMS2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":URMS2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.URMS2 };
        }
        if (message.Data.Fields.URMS3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":URMS3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.URMS3 };
        }
        if (message.Data.Fields.PREF != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PREF:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PREF * 1000 };
        }
        if (message.Data.Fields.PCOUP != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PCOUP:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PCOUP * 1000 };
        }
        if (message.Data.Fields.SINSTS != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SINSTS:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SINSTS };
        }
        if (message.Data.Fields.SINSTS1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SINSTS1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SINSTS1 };
        }
        if (message.Data.Fields.SINSTS2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SINSTS2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SINSTS2 };
        }
        if (message.Data.Fields.SINSTS3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SINSTS3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SINSTS3 };
        }
        if (message.Data.Fields.SMAXSN != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXSN:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SMAXSN };
        }
        if (message.Data.Fields.SMAXSN1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXSN1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SMAXSN1 };
        }
        if (message.Data.Fields.SMAXSN2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXSN2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SMAXSN2 };
        }
        if (message.Data.Fields.SMAXSN3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXSN3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SMAXSN3 };
        }
        if (message.Data.Fields["SMAXSN-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXSN-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["SMAXSN-1"] };
        }
        if (message.Data.Fields["SMAXSN1-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXSN1-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["SMAXSN1-1"] };
        }
        if (message.Data.Fields["SMAXSN2-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXSN2-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["SMAXSN2-1"] };
        }
        if (message.Data.Fields["SMAXSN3-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXSN3-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["SMAXSN3-1"] };
        }
        if (message.Data.Fields.SINSTI != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SINSTI:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SINSTI };
        }
        if (message.Data.Fields.SMAXIN != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXIN:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.SMAXIN };
        }
        if (message.Data.Fields["SMAXIN-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":SMAXIN-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["SMAXIN-1"] };
        }
        if (message.Data.Fields.CCASN != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":CCASN:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.CCASN };
        }
        if (message.Data.Fields["CCASN-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":CCASN-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["CCASN-1"] };
        }
        if (message.Data.Fields.CCAIN != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":CCAIN:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.CCAIN };
        }
        if (message.Data.Fields["CCAIN-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":CCAIN-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["CCAIN-1"] };
        }
        if (message.Data.Fields.UMOY1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":UMOY1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.UMOY1 };
        }
        if (message.Data.Fields.UMOY2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":UMOY2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.UMOY2 };
        }
        if (message.Data.Fields.UMOY3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":UMOY3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.UMOY3 };
        }
    }

    return points;
}

function tic_pmepmi(message, time)
{
    let points = {};
    if(message.Data == null){
        return points;
    }
    if (message.Data.ReadingPeriod != null) {
        let point =
            message.ClusterID +
            ":" +
            message.AttributeID +
            ":" +
            message.EndPoint;
        points[point] = { record: message.Data.ReadingPeriod };
    }
    if (message.Data.Fields != null) {
        if (message.Data.Fields.DATE != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DATE:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DATE };
        }
        if (message.Data.Fields.DATEPA1 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DATEPA1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DATEPA1 };
        }
        if (message.Data.Fields.DATEPA2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DATEPA2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DATEPA2 };
        }
        if (message.Data.Fields.DATEPA3 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DATEPA3:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DATEPA3 };
        }
        if (message.Data.Fields.DATEPA4 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DATEPA4:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DATEPA4 };
        }
        if (message.Data.Fields.DATEPA5 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DATEPA5:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DATEPA5 };
        }
        if (message.Data.Fields.DATEPA6 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DATEPA6:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DATEPA6 };
        }
        if (message.Data.Fields.DebP != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DebP:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.DebP };
        }
        if (message.Data.Fields["DebP-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DebP-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["DebP-1"] };
        }
        if (message.Data.Fields["FinP-1"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":FinP-1:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["FinP-1"] };
        }
        if (message.Data.Fields["DebP-1_2"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":DebP-1_2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["DebP-1_2"] };
        }
        if (message.Data.Fields["FinP-1_2"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":FinP-1_2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["FinP-1_2"] };
        }
        if (message.Data.Fields.EA_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EA_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EA_s };
        }
        if (message.Data.Fields["ER+_s"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER+_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER+_s"] };
        }
        if (message.Data.Fields["ER-_s"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER-_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER-_s"] };
        }
        if (message.Data.Fields.EAPP_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EAPP_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EAPP_s };
        }
        if (message.Data.Fields.EA_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EA_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EA_i };
        }
        if (message.Data.Fields.EAP_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EAP_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EAP_i };
        }
        if (message.Data.Fields.EAP_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EAP_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EAP_s };
        }
        if (message.Data.Fields["ER+_i"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER+_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER+_i"] };
        }
        if (message.Data.Fields["ER-_i"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER-_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER-_i"] };
        }
        if (message.Data.Fields.EAPP_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EAPP_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EAPP_i };
        }
        if (message.Data.Fields.PA1_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA1_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA1_s };
        }
        if (message.Data.Fields.PA1_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA1_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA1_i };
        }
        if (message.Data.Fields.PA2_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA2_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA2_s };
        }
        if (message.Data.Fields.PA2_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA2_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA2_i };
        }
        if (message.Data.Fields.PA3_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA3_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA3_s };
        }
        if (message.Data.Fields.PA3_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA3_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA3_i };
        }
        if (message.Data.Fields.PA4_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA4_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA4_s };
        }
        if (message.Data.Fields.PA4_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA4_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA4_i };
        }
        if (message.Data.Fields.PA5_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA5_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA5_s };
        }
        if (message.Data.Fields.PA5_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA5_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA5_i };
        }
        if (message.Data.Fields["ER+P_s"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER+P_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER+P_s"] * 1000 };
        }
        if (message.Data.Fields["ER-P_s"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER-P_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER-P_s"] * 1000 };
        }
        if (message.Data.Fields["ER+P_i"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER+P_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER+P_i"] * 1000 };
        }
        if (message.Data.Fields["ER-P_i"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER-P_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER-P_i"] * 1000 };
        }
        if (message.Data.Fields["EaP-1_s"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EaP-1_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["EaP-1_s"] };
        }
        if (message.Data.Fields["EaP-1_i"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EaP-1_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["EaP-1_i"] };
        }
        if (message.Data.Fields["ER+P-1_s"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER+P-1_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER+P-1_s"] * 1000 };
        }
        if (message.Data.Fields["ER0P-1_s"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER-P-1_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER-P-1_s"] * 1000 };
        }
        if (message.Data.Fields["ER+P-1_i"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER+P-1_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER+P-1_i"] * 1000 };
        }
        if (message.Data.Fields["ER-P-1_i"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":ER-P-1_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["ER-P-1_i"] * 1000 };
        }
        if (message.Data.Fields.PA1MN != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PA1MN:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PA1MN };
        }
        if (message.Data.Fields.PMAX_s != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAX_s:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAX_s };
        }
        if (message.Data.Fields.PMAX_i != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":PMAX_i:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.PMAX_i };
        }
        if (message.Data.Fields.EaP_s2 != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EaP_s2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields.EaP_s2 };
        }
        if (message.Data.Fields["EaP-1_s2"] != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":EaP-1_s2:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields["EaP-1_s2"] };
        }
        if (message.Data.Fields._DDMES1_ != null) {
            let point =
                message.ClusterID +
                ":" +
                message.AttributeID +
                ":_DDMES1_:" +
                message.EndPoint;
            points[point] = { record: message.Data.Fields._DDMES1_ };
        }
    }

    return points;
}


function extractPoints(input) {
  let message = input.message;
  let time = input.time;
  let model = input.model;

    switch (message.ClusterID) {
      case "Basic":
        return basic(message, time);
      case "SimpleMetering":
        return simpleMetering(message, time);
      case "Configuration":
        return configuration(message, time);
      case "Lorawan":
        return lorawan(message, time);
      case "Temperature":
        return temperature(message, time);
      case "BinaryInput":
        return binaryInput(message, time);
      case "RelativeHumidity":
        return relativeHumidity(message, time);
      case "AnalogInput":
        return analogInput(message, time, model);
      case "MultiBinaryInput":
        return multiBinaryInput(message, time);
      case "VolumeMeter":
        return volumeMeter(message, time);
      case "Senso":
        return senso(message, time);
      case "OnOff":
        return onOff(message, time);
      case "PowerQuality":
        return powerQuality(message, time);
      case "Pressure":
        return pressure(message, time);
      case "DifferentialPressure":
        return differentialPressure(message, time);
      case "TicIce":
        return tic_ice(message, time);
      case "TicCbe":
        return tic_cbe(message, time);
      case "TicCje":
        return tic_cje(message, time);
      case "TicStd":
        return tic_std(message, time);
      case "TicPmepmi":
        return tic_pmepmi.extractPoints(message, time);
      default:
        return {};
    }
}

exports.extractPoints = extractPoints;