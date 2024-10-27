interface Schema {
  ID: string
  Name: string
  Group: string
  GroupID: string
}

interface Group {
  id: string
  parentId: string
  name: string
}

interface VirtualTree {
  id: string
  name: string
}

export { Schema, Group, VirtualTree }
