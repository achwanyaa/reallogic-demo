'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { EquipmentItem } from './WarehouseScene'

interface ThreeWarehouseSceneProps {
  warehouseWidth: number
  warehouseLength: number
  warehouseHeight: number
  beamHeight: number
  equipment: EquipmentItem[]
  selectedId: string | null
  onSelectEquipment: (id: string | null) => void
}

export function ThreeWarehouseScene({
  warehouseWidth,
  warehouseLength,
  warehouseHeight,
  beamHeight,
  equipment,
  selectedId,
  onSelectEquipment,
}: ThreeWarehouseSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const equipmentGroupRef = useRef<THREE.Group | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const targetRef = useRef(new THREE.Vector3(0, warehouseHeight * 0.35, 0))
  const orbitRef = useRef({ azimuth: 0.65, elevation: 0.42, distance: 40 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#060708')
    scene.fog = new THREE.Fog(0x060708, 38, 90)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 140)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.HemisphereLight('#dbeafe', '#111827', 1.8)
    scene.add(ambient)
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.4)
    keyLight.position.set(12, 22, 10)
    keyLight.castShadow = true
    scene.add(keyLight)

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(warehouseWidth, 0.18, warehouseLength),
      new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.86, metalness: 0.08 })
    )
    floor.position.y = -0.09
    floor.receiveShadow = true
    scene.add(floor)

    const grid = new THREE.GridHelper(
      Math.max(warehouseWidth, warehouseLength),
      30,
      new THREE.Color('#334155'),
      new THREE.Color('#1e293b')
    )
    grid.scale.set(warehouseWidth / Math.max(warehouseWidth, warehouseLength), 1, warehouseLength / Math.max(warehouseWidth, warehouseLength))
    grid.position.y = 0.02
    scene.add(grid)

    const boundsMaterial = new THREE.MeshBasicMaterial({ color: '#34d399', wireframe: true, transparent: true, opacity: 0.24 })
    const bounds = new THREE.Mesh(new THREE.BoxGeometry(warehouseWidth, warehouseHeight, warehouseLength), boundsMaterial)
    bounds.position.y = warehouseHeight / 2
    scene.add(bounds)

    const beamMaterial = new THREE.MeshBasicMaterial({ color: '#f59e0b', wireframe: true, transparent: true, opacity: 0.7 })
    const beam = new THREE.Mesh(new THREE.BoxGeometry(warehouseWidth, 0.08, warehouseLength), beamMaterial)
    beam.position.y = beamHeight
    scene.add(beam)

    const equipmentGroup = new THREE.Group()
    equipmentGroupRef.current = equipmentGroup
    scene.add(equipmentGroup)

    const resize = () => {
      const width = mount.clientWidth || 1
      const height = mount.clientHeight || 1
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const updateCamera = () => {
      const orbit = orbitRef.current
      const horizontal = Math.cos(orbit.elevation) * orbit.distance
      camera.position.set(
        Math.sin(orbit.azimuth) * horizontal,
        targetRef.current.y + Math.sin(orbit.elevation) * orbit.distance,
        Math.cos(orbit.azimuth) * horizontal
      )
      camera.lookAt(targetRef.current)
    }

    const pointer = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    let dragging = false
    let moved = false
    let previousX = 0
    let previousY = 0

    const onPointerDown = (event: PointerEvent) => {
      dragging = true
      moved = false
      previousX = event.clientX
      previousY = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      const deltaX = event.clientX - previousX
      const deltaY = event.clientY - previousY
      if (Math.abs(deltaX) + Math.abs(deltaY) > 2) moved = true
      previousX = event.clientX
      previousY = event.clientY
      orbitRef.current.azimuth -= deltaX * 0.008
      orbitRef.current.elevation = THREE.MathUtils.clamp(orbitRef.current.elevation + deltaY * 0.006, 0.12, 1.25)
      updateCamera()
    }

    const onPointerUp = (event: PointerEvent) => {
      dragging = false
      renderer.domElement.releasePointerCapture(event.pointerId)
      if (moved) return
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(equipmentGroup.children, false)[0]
      const itemId = hit?.object.userData.itemId as string | undefined
      onSelectEquipment(itemId || null)
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      orbitRef.current.distance = THREE.MathUtils.clamp(orbitRef.current.distance + event.deltaY * 0.025, 18, 68)
      updateCamera()
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', resize)
    resize()
    updateCamera()

    let frame = 0
    const animate = () => {
      frame = window.requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('wheel', onWheel)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose())
        else mesh.material?.dispose()
      })
    }
  }, [beamHeight, warehouseHeight, warehouseLength, warehouseWidth, onSelectEquipment])

  useEffect(() => {
    const group = equipmentGroupRef.current
    if (!group) return
    while (group.children.length > 0) {
      const child = group.children.pop()
      if (child) group.remove(child)
    }

    equipment.forEach((item) => {
      const material = new THREE.MeshStandardMaterial({
        color: item.fits ? item.color : '#f43f5e',
        transparent: true,
        opacity: selectedId === item.id ? 0.92 : 0.72,
        roughness: 0.45,
        metalness: 0.18,
        emissive: selectedId === item.id ? item.color : '#000000',
        emissiveIntensity: selectedId === item.id ? 0.18 : 0,
      })
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(item.dimensions.length, item.dimensions.height, item.dimensions.width),
        material
      )
      mesh.position.set(item.position[0], item.dimensions.height / 2, item.position[2])
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData.itemId = item.id
      group.add(mesh)

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: item.fits ? '#d1fae5' : '#fecdd3' })
      )
      edges.position.copy(mesh.position)
      edges.userData.itemId = item.id
      group.add(edges)
    })
  }, [equipment, selectedId])

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', minHeight: '400px', cursor: 'grab' }} />
  )
}
