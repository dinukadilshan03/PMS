import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2px solid #6366f1',
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    color: '#4f46e5',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 5,
    borderBottom: '1px solid #e0e7ff',
  },
  label: {
    width: '30%',
    fontSize: 12,
    color: '#4f46e5',
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    width: '70%',
    fontSize: 12,
    color: '#1e293b',
  },
  status: {
    marginTop: 20,
    padding: 8,
    backgroundColor: '#e0e7ff',
    borderRadius: 4,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#4f46e5',
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
  },
});

interface AssignmentPDFProps {
  assignment: {
    id: string;
    dateTime: string;
    clientName: string;
    location: string;
    bookingStatus: string;
    packageName: string;
  };
}

export const AssignmentPDF = ({ assignment }: AssignmentPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Assignment Details</Text>
        <Text style={styles.subtitle}>Photography Management System</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Client Name:</Text>
          <Text style={styles.value}>{assignment.clientName}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Date & Time:</Text>
          <Text style={styles.value}>
            {new Date(assignment.dateTime).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{assignment.location}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Package:</Text>
          <Text style={styles.value}>{assignment.packageName}</Text>
        </View>
        
        <View style={styles.status}>
          <Text style={styles.statusText}>
            Status: {assignment.bookingStatus.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Generated on {new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
); 