import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface DataPoint {
  date: string;
  count: number;
}

interface SimpleLineChartProps {
  data: { [key: string]: number };
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width - 48;
  const chartHeight = 200;
  const chartPadding = { left: 35, right: 20, top: 10, bottom: 0 };
  const graphWidth = screenWidth - chartPadding.left - chartPadding.right;
  
  const dataArray: DataPoint[] = Object.keys(data)
    .sort()
    .slice(-5)
    .map(date => ({
      date,
      count: data[date]
    }));

  if (dataArray.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text style={styles.emptyText}>No hay datos suficientes</Text>
        <Text style={styles.emptySubtext}>Completa tareas para ver el gráfico</Text>
      </View>
    );
  }

  const maxValue = Math.max(...dataArray.map(d => d.count));
  
  const roundedMax = Math.max(4, Math.ceil(maxValue));
  
  const steps = 4;
  let stepValue = Math.ceil(roundedMax / steps);
  
  const adjustedMax = stepValue * steps;

  const numPoints = dataArray.length;
  const segmentWidth = graphWidth / numPoints;
  const pointOffset = segmentWidth / 2;

  const getPointPosition = (index: number, value: number) => {
    const x = chartPadding.left + (segmentWidth * index) + pointOffset;
    const y = chartHeight - ((value / adjustedMax) * chartHeight);
    return { x, y };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Últimos 5 días</Text>
      
      <View style={styles.chartContainer}>
        {[...Array(steps + 1)].map((_, i) => {
          const value = adjustedMax - (i * stepValue);
          const y = (chartHeight / steps) * i;
          
          return (
            <View key={i}>
              <View 
                style={[
                  styles.gridLine, 
                  { 
                    top: y,
                    left: chartPadding.left,
                    width: graphWidth
                  }
                ]} 
              />
              <Text style={[styles.yLabel, { top: y - 8 }]}>
                {value}
              </Text>
            </View>
          );
        })}

        <View style={[styles.lineContainer, { marginLeft: chartPadding.left }]}>
          {dataArray.map((point, index) => {
            if (index === 0) return null;
            
            const prevPoint = dataArray[index - 1];
            const curr = getPointPosition(index, point.count);
            const prev = getPointPosition(index - 1, prevPoint.count);
            
            const lineLength = Math.sqrt(
              Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
            );
            const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x) * (180 / Math.PI);

            return (
              <View
                key={`line-${index}`}
                style={[
                  styles.line,
                  {
                    left: prev.x - chartPadding.left,
                    top: prev.y,
                    width: lineLength,
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              />
            );
          })}

          {dataArray.map((point, index) => {
            const { x, y } = getPointPosition(index, point.count);

            return (
              <View key={`point-${index}`}>
                <View 
                  style={[
                    styles.pointGlow,
                    { 
                      left: x - chartPadding.left - 10,
                      top: y - 10
                    }
                  ]}
                />
                <View 
                  style={[
                    styles.point,
                    { 
                      left: x - chartPadding.left - 6,
                      top: y - 6
                    }
                  ]}
                />
                <Text 
                  style={[
                    styles.valueLabel,
                    { 
                      left: x - chartPadding.left - 10,
                      top: y - 32
                    }
                  ]}
                >
                  {point.count}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.xAxisLabels, { left: chartPadding.left }]}>
          {dataArray.map((point, index) => {
            const { x } = getPointPosition(index, 0);
            const [year, month, day] = point.date.split('-').map(Number);

            return (
              <Text
                key={index}
                style={[
                  styles.xLabel,
                  { 
                    left: x - chartPadding.left - 20,
                  }
                ]}
              >
                {`${day}/${month}`}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  chartTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  chartContainer: {
    height: 240,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  yLabel: {
    position: 'absolute',
    left: 0,
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
    width: 30,
  },
  lineContainer: {
    height: 200,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#00FFAA',
    transformOrigin: 'left center',
  },
  point: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FFAA',
    borderWidth: 3,
    borderColor: '#0A0A0A',
    zIndex: 2,
  },
  pointGlow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00FFAA',
    opacity: 0.3,
    zIndex: 1,
  },
  valueLabel: {
    position: 'absolute',
    color: '#00FFAA',
    fontSize: 14,
    fontWeight: '700',
    width: 40,
    textAlign: 'center',
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 40,
  },
  xLabel: {
    position: 'absolute',
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#444',
    fontSize: 13,
    marginTop: 8,
  },
});

export default SimpleLineChart;