import { useState } from "react";
import { Group } from "../types/group";
import {
  NormalizedCache,
  DeNormalize,
  CreateMasterInterface
} from "../types/generic";
import { Company } from "../types/company";

interface CreateMasterProps {
  groups: NormalizedCache<Group>;
  company?: NormalizedCache<Company>;
  defaultCompany?: number;
  toggle?(): void;
  onSave(formData: CreateMasterInterface): void;
}

const CreateMaster: React.FC<CreateMasterProps> = props => {
  const [name, setName] = useState("");
  const [group, setGroup] = useState(1);
  const [company, setCompany] = useState(1);

  // denormalize the cache
  const groups = DeNormalize<Group>(props.groups);
  const companies = DeNormalize<Company>(props.company);
  return (
    <div className="form-wrapper">
      <div className="form-div">
        <div
          className="close-button"
          onClick={() => {
            props.toggle();
          }}
        >
          X
        </div>
        <form>
          <label>Name</label>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
          />
          <br />
          <label>Select Group</label>
          <select
            value={group}
            onChange={e => {
              setGroup(parseInt(e.target.value));
            }}
          >
            {groups.map(group => (
              <option value={group.id}>{group.name}</option>
            ))}
          </select>
          <div>
            <label>Select Company</label>
            <select
              value={company}
              onChange={e => {
                setCompany(parseInt(e.target.value));
              }}
            >
              {companies.map(company => (
                <option value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={e => {
              e.preventDefault();
              props.onSave({ name, group, company });
            }}
          >
            Create
          </button>
        </form>
      </div>
      <style jsx>{`
        .form-wrapper {
          padding: 10px;
          z-index: 9999;
          width: 100%;
          height: 100%;
          position: fixed;
          top: 0px;
          right: 0px;
          background-color: rgba(10, 10, 10, 0.6);
        }
        .form-div {
          padding: 10px;
          background: white;
          width: 400px;
          margin: 0px auto;
        }
        input,
        select {
          padding: 10px;
          margin: 5px;
        }
        .close-button {
          float: right;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CreateMaster;
