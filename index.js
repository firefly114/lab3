import lib from './lib';
import fs from 'fs';

function initTree() {
  const tree = [
    {
      parent: null,
      _self: lib.parent,
    }
  ];
  
  lib.children.forEach((targetClass) => {
    tree.push({
      parent: Object.getPrototypeOf(targetClass),
      _self: targetClass,
    })
  })
  return tree;
}

function calculateDepth(tree, node = tree[0], depth = 0) {
  let result = depth + 1;
  tree.forEach((targetClass) => {
    if (targetClass.parent === node._self) {
      result = Math.max(result, calculateDepth(tree, targetClass, depth + 1));
    }
  })
  return result;
}

function nubmerOfChildren(node) {
  let result = 0;
  tree.forEach((targetClass) => {
    if (targetClass.parent === node._self) {
      result += 1
    }
  })
  return `Class ${node._self.name} - ${result}`;
}

const tree = initTree();

console.log(tree);
console.log('Depth:', calculateDepth(tree));
console.log('NOC', nubmerOfChildren(tree[3]));


try {
    // read contents of the file
    const data = fs.readFileSync('js_class.txt', 'UTF-8');

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    // MHF
    let Mh = 0;
    let Mv = 0;
    lines.forEach((line, index) => {
      if (line.match(/(class \w)/g)) {
        let privateCount = 0;
        let publicCount = 0;
        for (let i = index; !lines[i].includes('}') || lines[i].length > 2; i++) {
          if(lines[i].includes('#') && lines[i].includes('(')) {
            privateCount += 1;
          } else if(lines[i].includes('(')){
            publicCount += 1;
          }
        }
        Mh += privateCount;
        Mv += publicCount + privateCount;
      }
    });

    console.log('MHF', Mh/Mv);
    
    // AHF
    let Ah = 0
    let Ad = 0
    lines.forEach((line, index) => {
      if (line.match(/(class \w)/g)) {
        let privateCount = 0;
        let publicCount = 0;
        for (let i = index; !lines[i].includes('}') || lines[i].length > 2; i++) {
          if(!lines[i].includes('(') && !lines[i].includes(')')) {
            if(lines[i].includes('#') ) {
              privateCount += 1;
            } else {
              publicCount += 1;
            }
          }
        }
        Ah += privateCount;
        Ad += publicCount;
      }
    });
    console.log('AHF', Ah/Ad);
    const results = [];
    lines.forEach((line, parentIndex) => {
      if (line.match(/(class \w)/g)) {
        const className = line.split(' ')[1];

        const attrs = [];
        let allAttr = 0;
        for (let i = parentIndex+1; !lines[i].includes('}') || lines[i].length > 2; i++) {
          if(!lines[i].includes('(') && !lines[i].includes(')')) {
            allAttr += 1;
            attrs.push(lines[i]);
          }
        }
        results.push({className, allAttr});

        const childrenClasses = tree.filter((item) => {
          return item.parent && item.parent.name === className
        });
        childrenClasses.forEach((children) => {
          let inheriedAttr = 0;
          lines.forEach((childLine, index) => {
            if (line.match(/(class \w)/g)) {
              if(children._self.name === childLine.split(' ')[1]) {
                for (let i = index; !lines[i].includes('}') || lines[i].length > 2; i++) {
                  if(!lines[i].includes('(') && !lines[i].includes(')')) {
                    if(attrs.includes(lines[i])) {
                      inheriedAttr += 1;
                    }
                  }
                }
              }
            }
          })
          results.push({ className: children._self.name, inheriedAttr })
        })
      }
    });
    console.log(results);
    let Ai = 0
    let Aa = 0
    results.forEach((result) => {
      if(result.allAttr) {
        Aa += result.allAttr;
      } else if(result.inheriedAttr){
        Ai += result.inheriedAttr;
      }
    })
    console.log('AIF', Ai/Aa);


    const results2 = [];
    lines.forEach((line, parentIndex) => {
      if (line.match(/(class \w)/g)) {
        const className = line.split(' ')[1];

        const attrs = [];
        let allAttr = 0;
        for (let i = parentIndex+1; !lines[i].includes('}') || lines[i].length > 2; i++) {
          if(lines[i].includes('(')) {
            allAttr += 1;
            attrs.push(lines[i]);
          }
        }
        results2.push({className, allAttr});

        const childrenClasses = tree.filter((item) => {
          return item.parent && item.parent.name === className
        });
        childrenClasses.forEach((children) => {
          let inheriedAttr = 0;
          lines.forEach((childLine, index) => {
            if (line.match(/(class \w)/g)) {
              if(children._self.name === childLine.split(' ')[1]) {
                for (let i = index; !lines[i].includes('}') || lines[i].length > 2; i++) {
                  if(lines[i].includes('(')) {
                    if(attrs.includes(lines[i])) {
                      inheriedAttr += 1;
                    }
                  }
                }
              }
            }
          })
          results2.push({ className: children._self.name, inheriedAttr })
        })
      }
    });
    console.log(results2);
    let Mi = 0
    let Ma = 0
    results2.forEach((result) => {
      if(result.allAttr) {
        Ma += result.allAttr;
      } else if(result.inheriedAttr){
        Mi += result.inheriedAttr;
      }
    })
    console.log('MIF', Mi/Ma);


} catch (err) {
    console.error(err);
}