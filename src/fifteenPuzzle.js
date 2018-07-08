import prettierShowArr from "./debugging";

export default class FifteenPuzzle {
  static flattenPuzzle(arr) {
    const flattenedPuzzle = [];
    for(let i = 0; i < 4; i++) {
      flattenedPuzzle.push(...arr[i]);
    }
    return flattenedPuzzle;
  }
  puzzle = [];
  blank = 15;
  count = 0;
  // 초기화 
  init() {
    this.puzzle = this.getAvailablePuzzle(this.getRandomNumbers());
    this.count = 0;
  }
  // 랜덤 수를 담은 일차원 배열 구하기
  getRandomNumbers() {
    const arr = [];
    let number;
    for (let i = 0; i < 16; i++) {
      do {
        number = Math.floor(Math.random() * 16);
      } while (arr.includes(number));
      arr.push(number);
    }
    return arr;
  }
  // 게임에 규칙에 유효한 배열인지 확인하는 함수 
  isAvailableGame(arr) {
    // console.log(`만들어진 배열이 아래에서 유효한지 확인합니다. ${arr}`);
    let count = 0;
    const blankIndex = arr.indexOf(this.blank);
    // 반전쌍의 개수 카운트
    for (let i = 0; i < 16 - 1; i++) {
      for (let j = i + 1; j < 16; j++) {
        // console.log(`${i}번째의 ${arr[i]} 와 ${j}번째의 ${arr[j]}를 찾아서 비교합니다.`);
        if ((i !== blankIndex && j !== blankIndex) && arr[i] > arr[j]) {
          count++;
          // console.log(count);
        }
      }
    }
    // 반전쌍의 개수가 홀수일때 빈칸이 홀수 행에 있고 짝수일 때 짝수 행에 있는지
    if (
      (
        count % 2 === 1 && 
        (
          0 <= blankIndex && 4 > blankIndex || 
          8 <= blankIndex && 12 > blankIndex
        )
      ) ||
      (
        count % 2 === 0 && 
        (
          4 <= blankIndex && 8 > blankIndex || 
          12 <= blankIndex && 16 > blankIndex
        )
      )
    ) {
      // console.log(`[유효]반전쌍의 개수: ${count} / 빈칸의 인덱스: ${blankIndex}`);
      return true;
    } else {
      // console.log(`[재배열!]반전쌍의 개수: ${count} / 빈칸의 인덱스: ${blankIndex}`);
      return false;
    }
  }
  // 15퍼즐 규칙에 유효하면 다차원 배열을 반환한다.
  getAvailablePuzzle(arr) {
   if(this.isAvailableGame(arr)) {
    const puzzle = [];
      for (let i = 0; i < 4; i++) {
        puzzle.push(arr.splice(0, 4));
      }
      prettierShowArr(puzzle, '완성된 퍼즐');
      return puzzle;
   } else {
    return this.getAvailablePuzzle(this.getRandomNumbers());
   }
  }
  // 셀 위치 정보를 담은 객체 구하기
  getCellsPosition(arr, item) {
    const position = {};
    for (let i = 0; i < 4; i++) {
      if (arr[i].includes(item)) {
        position.r = i;
        position.c = arr[i].indexOf(item);
      }
    }
    return position;
  }
  // 변경된 행을 반환하는 함수 
  getMovedRow(pos, blankPos, arr) {
    const row = [];
    if (pos.c < blankPos.c) {
      for(let i = 0; i < 4; i++) {
        if (i < pos.c || i > blankPos.c) {
          row.push(arr[pos.r][i]);
        } else if (i === pos.c) {
          row.push(this.blank)
        } else {
          this.count++
          row.push(arr[pos.r][i - 1]);
        }
      }
    } else {
      for(let i = 0; i < 4; i++) {
        if (i > pos.c || i < blankPos.c) {
          row.push(arr[pos.r][i]);
        } else if (i === pos.c) {
          row.push(this.blank)
        } else {
          this.count++
          row.push(arr[pos.r][i + 1]);
        }
      }
    }
    return row;
  }
  // 재배열 된 열을 다시 배열에 담아 저장하는 함수
  setMoveCol(pos, blankPos, arr) {
    if (pos.r < blankPos.r) {
      this.puzzle = arr.map((item, row) => 
        item.map((it, col) => {
          if (col !== pos.c || row < pos.r || row > blankPos.r) {
            return it;
          } else if(row === pos.r) {
            return this.blank;
          } else {
            this.count++
            return arr[row - 1][col];
          }
        })
      );
    } else {
      this.puzzle = arr.map((item, row) => 
        item.map((it, col) => {
          if (col !== pos.c || row > pos.r || row < blankPos.r) {
            return it;
          } else if(row === pos.r) {
            return this.blank;
          } else {
            this.count++
            return arr[row + 1][col];
          }
        })
      );
    }
  }
  // 클릭한 번호를 입력받아 재배열하여 this.puzzle의 데이터를 업데이트
  updatePuzzle(num) {
    const arr = this.puzzle;
    // 클릭한 칸의 위치
    const pos = this.getCellsPosition(arr, num);
    // 빈칸의 위치
    const blankPos = this.getCellsPosition(arr, this.blank);
    if (pos.r === blankPos.r) {
      // ROW가 같다면
      arr[pos.r] = this.getMovedRow(pos, blankPos, arr)
    } else if (pos.c === blankPos.c) {
      // COL이 같다면
      this.setMoveCol(pos, blankPos, arr);
     } 
  }
  // 퍼즐이 다 정렬되었는지 확인하여 Boolean값 반환
  checkFinish() {
    return FifteenPuzzle.flattenPuzzle(this.puzzle).every((item, index, arr) => index === 0 ? true : item > arr[index - 1]); 
  }
}