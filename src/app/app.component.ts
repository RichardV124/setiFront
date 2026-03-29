import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MutantService } from './mutant.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Detector de Mutantes ADN';
  
  // Matriz de ADN con formularios reactivos
  gridSize: number = 6;
  dnaForm: FormArray;
  
  // Resultados
  result: boolean | null = null;
  errorMessage: string = '';
  sequences: Array<{
    positions: Array<{ row: number; col: number }>;
    direction: string;
    base: string;
  }> = [];

  // Ejemplos predefinidos
  examples = {
    mutant: ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"],
    noMutant: ["ATGCGA", "CAGTGC", "TTATTT", "AGACGG", "GCGTCA", "TCACTG"]
  };

  constructor(private mutantService: MutantService) {
    this.dnaForm = new FormArray<FormArray<FormControl<string>>>([]); 
    this.initializeGrid();
  }

  // Inicializa la matriz vacía
  initializeGrid(): void {
    this.dnaForm.clear();
    
    for (let i = 0; i < this.gridSize; i++) {
      const row = new FormArray<FormControl<string>>([]);
      for (let j = 0; j < this.gridSize; j++) {
        const control = new FormControl<string>('', { nonNullable: true });
        
        // Validación en tiempo real
        control.valueChanges.subscribe(value => {
          let cleaned = value.toUpperCase().replace(/[^ATCG]/g, '');
          if (cleaned.length > 1) {
            cleaned = cleaned.charAt(cleaned.length - 1);
          }
          if (value !== cleaned) {
            control.setValue(cleaned, { emitEvent: false });
          }
          
          // Limpiar resultados al editar
          this.result = null;
          this.errorMessage = '';
          this.sequences = [];
        });
        
        row.push(control);
      }
      this.dnaForm.push(row);
    }
  }

  // Obtener el FormArray de una fila
  getRow(rowIndex: number): FormArray<FormControl<string>> {
    return this.dnaForm.at(rowIndex) as FormArray<FormControl<string>>;
  }

  // Obtener el FormControl de una celda
  getCell(rowIndex: number, colIndex: number): FormControl<string> {
    return this.getRow(rowIndex).at(colIndex) as FormControl<string>;
  }

  // Analiza el ADN
  analyzeDNA(): void {
    this.errorMessage = '';
    this.result = null;
    this.sequences = [];
    
    // Convertir FormArray a array de strings
    const dna: string[] = [];
    for (let i = 0; i < this.gridSize; i++) {
      let row = '';
      for (let j = 0; j < this.gridSize; j++) {
        const cellValue = this.getCell(i, j).value;
        if (!cellValue) {
          this.errorMessage = 'Debes llenar todas las celdas de la matriz';
          return;
        }
        row += cellValue;
      }
      dna.push(row);
    }
    
    // Validar el ADN
    const validation = this.mutantService.validateDNA(dna);
    
    if (!validation.valid) {
      this.errorMessage = validation.error || 'Error de validación';
      return;
    }
    
    // Analizar si es mutante
    this.result = this.mutantService.isMutant(dna);
    
    // Obtener secuencias encontradas para mostrar
    this.sequences = this.mutantService.findMutantSequences(dna);
  }

  // Carga un ejemplo predefinido
  loadExample(type: 'mutant' | 'noMutant'): void {
    const example = this.examples[type];
    
    // Limpiar resultados primero
    this.result = null;
    this.errorMessage = '';
    this.sequences = [];
    
    // Cargar el ejemplo directamente
    for (let i = 0; i < example.length; i++) {
      for (let j = 0; j < example[i].length; j++) {
        this.getCell(i, j).setValue(example[i][j], { emitEvent: false });
      }
    }
  }

  // Verifica si una celda es parte de una secuencia mutante
  isInSequence(row: number, col: number): boolean {
    return this.sequences.some(seq => 
      seq.positions.some(pos => pos.row === row && pos.col === col)
    );
  }

  // Limpia la matriz
  clear(): void {
    this.initializeGrid();
    this.result = null;
    this.errorMessage = '';
    this.sequences = [];
  }
}
