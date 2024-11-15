import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-area',
  templateUrl: './file-area.component.html',
  styleUrls: ['./file-area.component.css']  // Fixed: Use styleUrls instead of styleUrl
})
export class FileAreaComponent implements OnInit, AfterViewInit {
  
   hrData: any = {}; 
  
  public headers: string[] = []; 
  public directory: any[] = [];  
  public filename: string = ''; 
  
  
  
  constructor(private http: HttpClient) {}
  personalDetails: any = {};
  personalDetailsKeys: string[] = [];
  skills: string[] = [];
  showData: boolean = false;

  ngOnInit() {
    this.fetchData();  // Optional: Uncomment to fetch data when the component loads
  }
  
  fetchData() {
    this.http.get<any>('http://localhost:3100/details')
      .subscribe(
        (data) => {
          // Assuming the data is an array, take the first entry (or adjust based on your actual data)
          this.hrData = data[0];  // If your data is an array, use the first entry
          
          // Extract personal details and skills
          this.personalDetails = this.hrData['personal details'];
          this.personalDetailsKeys = Object.keys(this.personalDetails);
          this.skills = this.hrData['skills'];
          
          // Show data once fetched successfully
          this.showData = true;
        },
        (error) => {
          console.error("Error fetching data:", error);
          this.showData = false;  // Keep this false if fetching fails
        }
      );
  }
  toggleView() {
    this.showData = !this.showData;  // Toggle the showData flag

    // If the data hasn't been fetched yet, call fetchData()
    if (this.showData && !this.personalDetails) {
      this.fetchData();
    }
  }

  


  fetchDirectory(): void {
       this.http.get<any[]>('http://localhost:3000/files')
      .subscribe({
        next: (data) => {
          // Assigning data directly to the directory variable
          this.directory = data; 
          console.log('Directory fetched:', this.directory); // Logging the fetched data
          
          // If you only want the file names, you can map the array:
          this.directory = this.directory.map(file => file.name);
          
          if (this.directory.length === 0) {
            console.warn('No files found in the directory.');
          }
        },
        error: (err) => {
          console.error('Error fetching directory:', err);
        }
      });
  }
  
  downloadFile() {
    if (this.filename) {
      const fileUrl = `http://localhost:3000/download/${this.filename}`;
      
      // Create an anchor element to trigger the download
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = this.filename; // This sets the filename for download
      document.body.appendChild(a);
      a.click(); // Programmatically click the anchor element
      document.body.removeChild(a); // Clean up
    } else {
      alert('Please enter a filename to download.');
    }
  }


  

  ngAfterViewInit() {
    const uploadIcon = document.getElementById('uploadIcon');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadIcon) {
      uploadIcon.addEventListener('click', () => {
        console.log("Icon clicked");
        if (fileInput) {
          fileInput.click();
        }
      });
    }   
}
}
