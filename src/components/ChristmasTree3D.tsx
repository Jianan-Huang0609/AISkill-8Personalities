import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { AssessmentResult } from '../types/questionnaire';
import './ChristmasTree3D.css';

export default function ChristmasTree3D({ result }: { result: AssessmentResult }) {
  return (
    <div className="christmas-tree-container">
      <div className="tree-canvas-wrapper">
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <pointLight position={[-10, 10, -10]} color="#8b5cf6" />
          <Stars radius={100} depth={50} count={5000} factor={4} />
          <TreeModel result={result} />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Canvas>
      </div>
      <div className="tree-info">
        <h2>🎄 你的2025年度圣诞树</h2>
        <p>这棵树代表你在2025年的AI技能成长</p>
        <div className="tree-stats">
          <div className="stat-item">
            <span className="stat-label">树高</span>
            <span className="stat-value">
              {((result.scores.engineering + result.scores.theory) / 2 + 3).toFixed(1)}m
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">装饰球</span>
            <span className="stat-value">{result.scores.collaboration * 3}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">星星</span>
            <span className="stat-value">{result.scores.influence * 2}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">彩灯</span>
            <span className="stat-value">{result.scores.innovation * 4}</span>
          </div>
        </div>
        <div className="interaction-hint">
          <p>💡 提示：拖动鼠标旋转视角，滚轮缩放</p>
        </div>
      </div>
    </div>
  );
}

function TreeModel({ result }: { result: AssessmentResult }) {
  const { scores, badges } = result;
  
  // 计算树形参数
  const height = (scores.engineering + scores.theory) / 2 + 3;
  const width = (scores.innovation + scores.aesthetics) / 2 + 2;
  const particleCount = Math.floor(scores.learning * 150 + scores.radar * 50);

  return (
    <group>
      {/* 树干 */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, height * 0.3, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* 树层 */}
      {[0, 1, 2, 3].map((layer, i) => {
        const layerHeight = height * 0.2 + i * height * 0.15;
        const layerWidth = width * (1 - i * 0.2);
        
        return (
          <mesh key={i} position={[0, layerHeight, 0]} castShadow>
            <coneGeometry args={[layerWidth, height * 0.3, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#228B22" : "#32CD32"} 
              emissive="#00ff00"
              emissiveIntensity={0.1}
            />
          </mesh>
        );
      })}

      {/* 装饰球 - 协作资产 */}
      {Array.from({ length: Math.floor(scores.collaboration * 3) }).map((_, i) => {
        const angle = (i / Math.floor(scores.collaboration * 3)) * Math.PI * 2;
        const radius = width * 0.6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = height * 0.3 + (i % 3) * height * 0.2;
        
        return (
          <mesh key={i} position={[x, y, z]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial 
              color={i % 3 === 0 ? "#ff0000" : i % 3 === 1 ? "#0000ff" : "#ffff00"}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}

      {/* 星星 - 影响力 */}
      {Array.from({ length: Math.max(1, Math.floor(scores.influence * 2)) }).map((_, i) => {
        const y = height * 0.9;
        const angle = (i / Math.max(1, Math.floor(scores.influence * 2))) * Math.PI * 2;
        
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[0, angle, 0]}>
            <coneGeometry args={[0.2, 0.3, 5]} />
            <meshStandardMaterial 
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}

      {/* 彩灯 - 创新 */}
      {Array.from({ length: Math.floor(scores.innovation * 4) }).map((_, i) => {
        const angle = (i / Math.floor(scores.innovation * 4)) * Math.PI * 2;
        const radius = width * 0.4 + (i % 2) * width * 0.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = height * 0.2 + (i % 4) * height * 0.15;
        
        return (
          <pointLight
            key={i}
            position={[x, y, z]}
            color={i % 3 === 0 ? "#ff0000" : i % 3 === 1 ? "#00ff00" : "#0000ff"}
            intensity={0.5}
            distance={5}
          />
        );
      })}
    </group>
  );
}


